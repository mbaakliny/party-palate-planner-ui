
<?php
/**
 * Plugin Name: Catering Menu Pro
 * Plugin URI: https://yoursite.com
 * Description: Professional catering menu with order management system
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: catering-menu-pro
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CMP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CMP_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CMP_VERSION', '1.0.0');

// Main plugin class
class CateringMenuPro {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        // Load required files
        require_once CMP_PLUGIN_PATH . 'includes/class-database.php';
        require_once CMP_PLUGIN_PATH . 'includes/class-shortcodes.php';
        require_once CMP_PLUGIN_PATH . 'includes/class-admin.php';
        require_once CMP_PLUGIN_PATH . 'includes/class-api.php';
        require_once CMP_PLUGIN_PATH . 'includes/class-assets.php';
        
        // Initialize components
        new CMP_Database();
        new CMP_Shortcodes();
        new CMP_Admin();
        new CMP_API();
        new CMP_Assets();
        
        // Load text domain
        load_plugin_textdomain('catering-menu-pro', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function activate() {
        // Create database tables
        CMP_Database::create_tables();
        
        // Set default options
        add_option('cmp_email_notifications', true);
        add_option('cmp_admin_email', get_option('admin_email'));
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    public function deactivate() {
        // Clean up if needed
        flush_rewrite_rules();
    }
}

// Initialize the plugin
new CateringMenuPro();
