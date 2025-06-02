
<?php
/**
 * Asset management for Catering Menu Pro
 */

class CMP_Assets {
    
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
    }
    
    public function enqueue_frontend_assets() {
        // Only enqueue on pages that might have the shortcode
        if (is_admin()) return;
        
        // Register the built React app assets
        wp_register_script(
            'catering-menu-app',
            CMP_PLUGIN_URL . 'build/assets/index.js',
            array(),
            CMP_VERSION,
            true
        );
        
        wp_register_style(
            'catering-menu-style',
            CMP_PLUGIN_URL . 'build/assets/index.css',
            array(),
            CMP_VERSION
        );
        
        // Add inline CSS for better integration
        $custom_css = "
        .catering-menu-container {
            max-width: 100%;
            font-family: inherit;
        }
        .catering-menu-container * {
            box-sizing: border-box;
        }
        ";
        wp_add_inline_style('catering-menu-style', $custom_css);
    }
}
