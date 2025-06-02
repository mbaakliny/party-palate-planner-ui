
# Catering Menu Pro - Installation Guide

## Quick Installation

1. **Download & Install Plugin**
   - Upload the `catering-menu-pro` folder to `/wp-content/plugins/`
   - OR upload the zip file via WordPress admin (Plugins > Add New > Upload)
   - Activate the plugin

2. **Build the React App**
   ```bash
   # In your React project root
   npm run build-wordpress
   
   # Copy build folder to plugin directory
   cp -r build wordpress-plugin/catering-menu-pro/
   ```

3. **Use the Shortcode**
   - Add `[catering_menu]` to any page, post, or Elementor section
   - The menu will load automatically

## Manual Build Process

If you don't have the build commands set up:

1. **Install Vite (if not already installed)**
   ```bash
   npm install vite --save-dev
   ```

2. **Build for WordPress**
   ```bash
   npx vite build --config wordpress-plugin/catering-menu-pro/build-config/vite.config.wordpress.js
   ```

3. **Copy build files**
   - Copy the generated `dist` folder contents to `wordpress-plugin/catering-menu-pro/build/`

## Elementor Integration

1. **Create a new page or edit existing page in Elementor**
2. **Add a Shortcode widget**
3. **Enter shortcode:** `[catering_menu]`
4. **Publish and view**

## Admin Features

After activation, you'll find:
- **Catering Menu** in WordPress admin sidebar
- **Orders**: View and manage customer orders
- **Settings**: Configure email notifications
- **Menu Items**: View current menu (database-driven)

## Troubleshooting

**Menu not loading?**
- Check if build files exist in `build/` directory
- Verify plugin is activated
- Check browser console for JavaScript errors

**Orders not saving?**
- Check database tables were created (wp_cmp_orders, wp_cmp_menu_items)
- Verify WordPress REST API is working

**Styling issues?**
- Plugin includes CSS reset for Elementor compatibility
- Add custom CSS in WordPress Customizer if needed

## Support

For technical support or customization requests, contact the plugin developer.
