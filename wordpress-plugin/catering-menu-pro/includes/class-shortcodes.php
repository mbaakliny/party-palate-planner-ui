
<?php
/**
 * Shortcode functionality for Catering Menu Pro
 */

class CMP_Shortcodes {
    
    public function __construct() {
        add_shortcode('catering_menu', array($this, 'render_catering_menu'));
    }
    
    public function render_catering_menu($atts) {
        $atts = shortcode_atts(array(
            'theme' => 'default',
            'show_categories' => 'all'
        ), $atts);
        
        // Enqueue assets
        wp_enqueue_script('catering-menu-app');
        wp_enqueue_style('catering-menu-style');
        
        // Localize script with data
        wp_localize_script('catering-menu-app', 'cateringMenuData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('catering_menu_nonce'),
            'apiUrl' => rest_url('catering-menu/v1/'),
            'restNonce' => wp_create_nonce('wp_rest')
        ));
        
        ob_start();
        ?>
        <div id="catering-menu-root" class="catering-menu-container">
            <div class="catering-menu-loading">
                <p>Loading menu...</p>
            </div>
        </div>
        
        <style>
        .catering-menu-container {
            width: 100%;
            min-height: 400px;
            margin: 20px 0;
        }
        .catering-menu-loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        </style>
        <?php
        return ob_get_clean();
    }
}
