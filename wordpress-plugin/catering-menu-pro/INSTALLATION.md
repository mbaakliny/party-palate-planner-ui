
# Catering Menu Pro - Installation Guide

## Quick Installation

1. **Download & Install Plugin**
   - Upload the `catering-menu-pro` folder to `/wp-content/plugins/`
   - OR upload the zip file via WordPress admin (Plugins > Add New > Upload)
   - Activate the plugin

2. **Build the React App**
   ```bash
   # Make sure you have the vite.config.wordpress.js file in your project root
   # Then run the build script
   node build-wordpress.js
   
   # OR manually with npx:
   npx vite build --config vite.config.wordpress.js
   ```

3. **Use the Shortcode**
   - Add `[catering_menu]` to any page, post, or Elementor section
   - The menu will load automatically

## Manual Build Process

If you need to build manually:

1. **Ensure Vite is available**
   ```bash
   # Vite should be available via npx, if not install it:
   npm install vite --save-dev
   ```

2. **Build for WordPress**
   ```bash
   npx vite build --config vite.config.wordpress.js
   ```

3. **Verify build files**
   - Check that `wordpress-plugin/catering-menu-pro/build/` contains:
     - `assets/index.js` (the React app)
     - `assets/index.css` (styles)

## Build Script Usage

The `build-wordpress.js` script will:
- Check if the WordPress Vite config exists
- Run the build process
- Verify the output files are created
- Provide next steps for plugin installation

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

**Plugin activation fails?**
- Check WordPress error logs
- Ensure PHP version is 7.4 or higher
- Verify database permissions

**Menu not loading?**
- Check if build files exist in `build/` directory
- Verify plugin is activated
- Check browser console for JavaScript errors
- Ensure WordPress REST API is working

**Orders not saving?**
- Check database tables were created (wp_cmp_orders, wp_cmp_menu_items)
- Verify WordPress REST API is working
- Check browser console for API errors

**Styling issues?**
- Plugin includes CSS reset for Elementor compatibility
- Add custom CSS in WordPress Customizer if needed

## Build Files Location

The build process creates files in:
```
wordpress-plugin/catering-menu-pro/build/
├── assets/
│   ├── index.js    (React app bundle)
│   └── index.css   (Styles)
```

## Support

For technical support or customization requests, contact the plugin developer.
