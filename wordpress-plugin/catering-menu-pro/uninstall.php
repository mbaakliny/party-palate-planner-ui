<?php
/**
 * Fired when the plugin is uninstalled.
 */

// If uninstall not called from WordPress, then exit.
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Delete options
delete_option('cmp_email_notifications');
delete_option('cmp_admin_email');

// Drop tables if needed (optional - you may want to keep data)
// global $wpdb;
// $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}cmp_orders");
// $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}cmp_menu_items");
