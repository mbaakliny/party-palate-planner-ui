
<?php
/**
 * REST API functionality for Catering Menu Pro
 */

class CMP_API {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('wp_ajax_submit_catering_order', array($this, 'handle_order_submission'));
        add_action('wp_ajax_nopriv_submit_catering_order', array($this, 'handle_order_submission'));
    }
    
    public function register_routes() {
        register_rest_route('catering-menu/v1', '/menu-items', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_menu_items'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('catering-menu/v1', '/submit-order', array(
            'methods' => 'POST',
            'callback' => array($this, 'submit_order'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function get_menu_items() {
        $items = CMP_Database::get_menu_items();
        
        // Group items by category
        $grouped_items = array();
        foreach ($items as $item) {
            $category = $item->category;
            if (!isset($grouped_items[$category])) {
                $grouped_items[$category] = array();
            }
            
            $grouped_items[$category][] = array(
                'id' => intval($item->id),
                'name' => $item->name,
                'description' => $item->description,
                'image' => $item->image_url,
                'prices' => array(
                    'small' => floatval($item->price_small),
                    'big' => floatval($item->price_big)
                ),
                'vegan' => (bool) $item->is_vegan
            );
        }
        
        return rest_ensure_response($grouped_items);
    }
    
    public function submit_order($request) {
        $data = $request->get_json_params();
        
        // Validate required fields
        if (empty($data['items']) || empty($data['total_amount'])) {
            return new WP_Error('invalid_data', 'Missing required order data', array('status' => 400));
        }
        
        // Save order to database
        $order_id = CMP_Database::save_order($data);
        
        if ($order_id) {
            // Send email notification if enabled
            if (get_option('cmp_email_notifications', true)) {
                $this->send_order_notification($data, $order_id);
            }
            
            return rest_ensure_response(array(
                'success' => true,
                'order_id' => $order_id,
                'message' => 'Order submitted successfully!'
            ));
        } else {
            return new WP_Error('order_failed', 'Failed to save order', array('status' => 500));
        }
    }
    
    public function handle_order_submission() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'catering_menu_nonce')) {
            wp_die('Security check failed');
        }
        
        $order_data = json_decode(stripslashes($_POST['order_data']), true);
        
        // Save order
        $order_id = CMP_Database::save_order($order_data);
        
        if ($order_id) {
            // Send notification
            if (get_option('cmp_email_notifications', true)) {
                $this->send_order_notification($order_data, $order_id);
            }
            
            wp_send_json_success(array(
                'order_id' => $order_id,
                'message' => 'Order submitted successfully!'
            ));
        } else {
            wp_send_json_error('Failed to save order');
        }
    }
    
    private function send_order_notification($order_data, $order_id) {
        $admin_email = get_option('cmp_admin_email', get_option('admin_email'));
        $site_name = get_bloginfo('name');
        
        $subject = 'New Catering Order #' . $order_id . ' - ' . $site_name;
        
        $message = "New catering order received!\n\n";
        $message .= "Order ID: #" . $order_id . "\n";
        $message .= "Customer: " . ($order_data['customer_name'] ?: 'Guest') . "\n";
        $message .= "Email: " . $order_data['customer_email'] . "\n";
        $message .= "Phone: " . $order_data['customer_phone'] . "\n";
        $message .= "Total Amount: $" . number_format($order_data['total_amount'], 2) . "\n\n";
        
        $message .= "Order Items:\n";
        foreach ($order_data['items'] as $item) {
            $message .= "- " . $item['itemName'] . " (" . $item['celebrationSize'] . ") x" . $item['quantity'] . " = $" . number_format($item['totalPrice'], 2) . "\n";
        }
        
        $message .= "\nView order details in WordPress admin: " . admin_url('admin.php?page=catering-menu-orders');
        
        wp_mail($admin_email, $subject, $message);
        
        // Send confirmation to customer if email provided
        if (!empty($order_data['customer_email'])) {
            $customer_subject = 'Order Confirmation #' . $order_id . ' - ' . $site_name;
            $customer_message = "Thank you for your catering order!\n\n";
            $customer_message .= "Order ID: #" . $order_id . "\n";
            $customer_message .= "Total: $" . number_format($order_data['total_amount'], 2) . "\n\n";
            $customer_message .= "We will contact you soon to confirm your order details.\n\n";
            $customer_message .= "Thank you for choosing " . $site_name . "!";
            
            wp_mail($order_data['customer_email'], $customer_subject, $customer_message);
        }
    }
}
