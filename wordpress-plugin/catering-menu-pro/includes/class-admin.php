
<?php
/**
 * Admin functionality for Catering Menu Pro
 */

class CMP_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Catering Menu Pro',
            'Catering Menu',
            'manage_options',
            'catering-menu-pro',
            array($this, 'admin_page'),
            'dashicons-food',
            30
        );
        
        add_submenu_page(
            'catering-menu-pro',
            'Orders',
            'Orders',
            'manage_options',
            'catering-menu-orders',
            array($this, 'orders_page')
        );
        
        add_submenu_page(
            'catering-menu-pro',
            'Menu Items',
            'Menu Items',
            'manage_options',
            'catering-menu-items',
            array($this, 'menu_items_page')
        );
        
        add_submenu_page(
            'catering-menu-pro',
            'Settings',
            'Settings',
            'manage_options',
            'catering-menu-settings',
            array($this, 'settings_page')
        );
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'catering-menu') !== false) {
            wp_enqueue_style('catering-menu-admin', CMP_PLUGIN_URL . 'assets/admin.css', array(), CMP_VERSION);
            wp_enqueue_script('catering-menu-admin', CMP_PLUGIN_URL . 'assets/admin.js', array('jquery'), CMP_VERSION, true);
            
            wp_localize_script('catering-menu-admin', 'cmpAdmin', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('cmp_admin_nonce')
            ));
        }
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Catering Menu Pro</h1>
            <div class="cmp-dashboard">
                <div class="cmp-card">
                    <h3>Quick Stats</h3>
                    <?php
                    global $wpdb;
                    $orders_table = $wpdb->prefix . 'cmp_orders';
                    $total_orders = $wpdb->get_var("SELECT COUNT(*) FROM $orders_table");
                    $pending_orders = $wpdb->get_var("SELECT COUNT(*) FROM $orders_table WHERE status = 'pending'");
                    $total_revenue = $wpdb->get_var("SELECT SUM(total_amount) FROM $orders_table WHERE status IN ('completed', 'processing')");
                    ?>
                    <p><strong>Total Orders:</strong> <?php echo $total_orders; ?></p>
                    <p><strong>Pending Orders:</strong> <?php echo $pending_orders; ?></p>
                    <p><strong>Total Revenue:</strong> $<?php echo number_format($total_revenue ?: 0, 2); ?></p>
                </div>
                
                <div class="cmp-card">
                    <h3>Shortcode Usage</h3>
                    <p>Use this shortcode to display the catering menu:</p>
                    <code>[catering_menu]</code>
                    <p>Perfect for Elementor pages and posts!</p>
                </div>
                
                <div class="cmp-card">
                    <h3>Recent Orders</h3>
                    <?php
                    $recent_orders = CMP_Database::get_orders(5, 0);
                    if ($recent_orders) {
                        echo '<ul>';
                        foreach ($recent_orders as $order) {
                            echo '<li>';
                            echo '<strong>' . esc_html($order->customer_name ?: 'Guest') . '</strong> - ';
                            echo '$' . number_format($order->total_amount, 2) . ' - ';
                            echo '<span class="status-' . $order->status . '">' . ucfirst($order->status) . '</span>';
                            echo '</li>';
                        }
                        echo '</ul>';
                    } else {
                        echo '<p>No orders yet.</p>';
                    }
                    ?>
                </div>
            </div>
        </div>
        
        <style>
        .cmp-dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .cmp-card {
            background: #fff;
            border: 1px solid #ccd0d4;
            padding: 20px;
            border-radius: 4px;
        }
        .cmp-card h3 {
            margin-top: 0;
        }
        .status-pending { color: #d63638; }
        .status-processing { color: #d54e21; }
        .status-completed { color: #46b450; }
        </style>
        <?php
    }
    
    public function orders_page() {
        if (isset($_POST['update_status']) && wp_verify_nonce($_POST['_wpnonce'], 'update_order_status')) {
            global $wpdb;
            $table = $wpdb->prefix . 'cmp_orders';
            $wpdb->update(
                $table,
                array('status' => sanitize_text_field($_POST['status'])),
                array('id' => intval($_POST['order_id']))
            );
            echo '<div class="notice notice-success"><p>Order status updated!</p></div>';
        }
        
        $orders = CMP_Database::get_orders(50, 0);
        ?>
        <div class="wrap">
            <h1>Orders</h1>
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($orders as $order): ?>
                    <tr>
                        <td><?php echo $order->id; ?></td>
                        <td><?php echo esc_html($order->customer_name ?: 'Guest'); ?></td>
                        <td><?php echo esc_html($order->customer_email); ?></td>
                        <td><?php echo esc_html($order->customer_phone); ?></td>
                        <td>$<?php echo number_format($order->total_amount, 2); ?></td>
                        <td>
                            <form method="post" style="display: inline;">
                                <?php wp_nonce_field('update_order_status'); ?>
                                <input type="hidden" name="order_id" value="<?php echo $order->id; ?>">
                                <select name="status" onchange="this.form.submit()">
                                    <option value="pending" <?php selected($order->status, 'pending'); ?>>Pending</option>
                                    <option value="processing" <?php selected($order->status, 'processing'); ?>>Processing</option>
                                    <option value="completed" <?php selected($order->status, 'completed'); ?>>Completed</option>
                                    <option value="cancelled" <?php selected($order->status, 'cancelled'); ?>>Cancelled</option>
                                </select>
                                <input type="hidden" name="update_status" value="1">
                            </form>
                        </td>
                        <td><?php echo date('M j, Y g:i A', strtotime($order->created_at)); ?></td>
                        <td>
                            <button class="button view-order-details" data-order='<?php echo esc_attr($order->order_data); ?>'>
                                View Details
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <div id="order-details-modal" style="display: none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Order Details</h3>
                <div id="order-items"></div>
            </div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            $('.view-order-details').click(function() {
                var orderData = JSON.parse($(this).attr('data-order'));
                var html = '<ul>';
                $.each(orderData, function(key, item) {
                    html += '<li>' + item.itemName + ' (' + item.celebrationSize + ') - Qty: ' + item.quantity + ' - $' + item.totalPrice.toFixed(2) + '</li>';
                });
                html += '</ul>';
                $('#order-items').html(html);
                $('#order-details-modal').show();
            });
            
            $('.close').click(function() {
                $('#order-details-modal').hide();
            });
        });
        </script>
        
        <style>
        #order-details-modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 600px;
            position: relative;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: black;
        }
        </style>
        <?php
    }
    
    public function menu_items_page() {
        ?>
        <div class="wrap">
            <h1>Menu Items</h1>
            <p>Menu items are managed through the database. Use the WordPress admin to add/edit items or customize the plugin code for a full admin interface.</p>
            
            <?php
            $menu_items = CMP_Database::get_menu_items();
            if ($menu_items) {
                echo '<table class="wp-list-table widefat fixed striped">';
                echo '<thead><tr><th>Name</th><th>Category</th><th>Small Price</th><th>Big Price</th><th>Vegan</th></tr></thead>';
                echo '<tbody>';
                foreach ($menu_items as $item) {
                    echo '<tr>';
                    echo '<td>' . esc_html($item->name) . '</td>';
                    echo '<td>' . esc_html($item->category) . '</td>';
                    echo '<td>$' . number_format($item->price_small, 2) . '</td>';
                    echo '<td>$' . number_format($item->price_big, 2) . '</td>';
                    echo '<td>' . ($item->is_vegan ? 'Yes' : 'No') . '</td>';
                    echo '</tr>';
                }
                echo '</tbody></table>';
            }
            ?>
        </div>
        <?php
    }
    
    public function settings_page() {
        if (isset($_POST['submit']) && wp_verify_nonce($_POST['_wpnonce'], 'cmp_settings')) {
            update_option('cmp_email_notifications', isset($_POST['email_notifications']));
            update_option('cmp_admin_email', sanitize_email($_POST['admin_email']));
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }
        
        $email_notifications = get_option('cmp_email_notifications', true);
        $admin_email = get_option('cmp_admin_email', get_option('admin_email'));
        ?>
        <div class="wrap">
            <h1>Settings</h1>
            
            <form method="post">
                <?php wp_nonce_field('cmp_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Email Notifications</th>
                        <td>
                            <label>
                                <input type="checkbox" name="email_notifications" <?php checked($email_notifications); ?>>
                                Send email notifications for new orders
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Admin Email</th>
                        <td>
                            <input type="email" name="admin_email" value="<?php echo esc_attr($admin_email); ?>" class="regular-text">
                            <p class="description">Email address to receive order notifications</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}
