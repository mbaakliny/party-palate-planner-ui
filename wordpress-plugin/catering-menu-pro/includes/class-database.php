
<?php
/**
 * Database operations for Catering Menu Pro
 */

class CMP_Database {
    
    public function __construct() {
        // Constructor logic if needed
    }
    
    public static function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Orders table
        $orders_table = $wpdb->prefix . 'cmp_orders';
        $orders_sql = "CREATE TABLE $orders_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            order_data longtext NOT NULL,
            customer_email varchar(100),
            customer_phone varchar(20),
            customer_name varchar(100),
            total_amount decimal(10,2) NOT NULL,
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Menu items table
        $menu_table = $wpdb->prefix . 'cmp_menu_items';
        $menu_sql = "CREATE TABLE $menu_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(200) NOT NULL,
            description text,
            category varchar(100),
            price_small decimal(10,2),
            price_big decimal(10,2),
            image_url varchar(500),
            is_vegan tinyint(1) DEFAULT 0,
            is_active tinyint(1) DEFAULT 1,
            sort_order int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($orders_sql);
        dbDelta($menu_sql);
        
        // Insert default menu items
        self::insert_default_menu_items();
    }
    
    private static function insert_default_menu_items() {
        global $wpdb;
        
        $menu_table = $wpdb->prefix . 'cmp_menu_items';
        
        // Check if items already exist
        $count = $wpdb->get_var("SELECT COUNT(*) FROM $menu_table");
        if ($count > 0) return;
        
        $default_items = array(
            array(
                'name' => 'Classic Meat Pies',
                'description' => 'Traditional beef pies with flaky pastry',
                'category' => 'Party Pastries',
                'price_small' => 15.00,
                'price_big' => 25.00,
                'image_url' => 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
                'is_vegan' => 0
            ),
            array(
                'name' => 'Spinach',
                'description' => 'Fresh spinach pastries with feta cheese',
                'category' => 'Party Pastries',
                'price_small' => 12.50,
                'price_big' => 22.50,
                'image_url' => 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
                'is_vegan' => 0
            ),
            array(
                'name' => 'Plant Vegan',
                'description' => 'Delicious plant-based pastries',
                'category' => 'Party Pastries',
                'price_small' => 14.50,
                'price_big' => 24.50,
                'image_url' => 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
                'is_vegan' => 1
            ),
            array(
                'name' => 'Greek Salad',
                'description' => 'Fresh tomatoes, olives, feta cheese',
                'category' => 'Salads & Dips',
                'price_small' => 18.00,
                'price_big' => 32.00,
                'image_url' => 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
                'is_vegan' => 0
            ),
            array(
                'name' => 'Hummus',
                'description' => 'Traditional chickpea hummus with tahini',
                'category' => 'Salads & Dips',
                'price_small' => 9.50,
                'price_big' => 16.50,
                'image_url' => 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
                'is_vegan' => 1
            ),
            array(
                'name' => 'Garden Salad',
                'description' => 'Mixed greens with seasonal vegetables',
                'category' => 'Salads & Dips',
                'price_small' => 15.00,
                'price_big' => 28.00,
                'image_url' => 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
                'is_vegan' => 1
            ),
            array(
                'name' => 'Chicken Mediterranean',
                'description' => 'Grilled chicken with Mediterranean herbs',
                'category' => 'Platters & Wraps',
                'price_small' => 25.00,
                'price_big' => 45.00,
                'image_url' => 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
                'is_vegan' => 0
            ),
            array(
                'name' => 'Vegetarian Delight',
                'description' => 'Fresh vegetables with hummus wrap',
                'category' => 'Platters & Wraps',
                'price_small' => 19.50,
                'price_big' => 35.00,
                'image_url' => 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
                'is_vegan' => 1
            ),
            array(
                'name' => 'Mixed Platter',
                'description' => 'Assorted meats and cheeses',
                'category' => 'Platters & Wraps',
                'price_small' => 28.00,
                'price_big' => 52.00,
                'image_url' => 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
                'is_vegan' => 0
            )
        );
        
        foreach ($default_items as $item) {
            $wpdb->insert($menu_table, $item);
        }
    }
    
    public static function get_menu_items() {
        global $wpdb;
        $table = $wpdb->prefix . 'cmp_menu_items';
        return $wpdb->get_results("SELECT * FROM $table WHERE is_active = 1 ORDER BY category, sort_order, name");
    }
    
    public static function save_order($order_data) {
        global $wpdb;
        $table = $wpdb->prefix . 'cmp_orders';
        
        return $wpdb->insert(
            $table,
            array(
                'order_data' => json_encode($order_data['items']),
                'customer_email' => sanitize_email($order_data['customer_email']),
                'customer_phone' => sanitize_text_field($order_data['customer_phone']),
                'customer_name' => sanitize_text_field($order_data['customer_name']),
                'total_amount' => floatval($order_data['total_amount']),
                'status' => 'pending'
            )
        );
    }
    
    public static function get_orders($limit = 50, $offset = 0) {
        global $wpdb;
        $table = $wpdb->prefix . 'cmp_orders';
        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $limit, $offset
        ));
    }
}
