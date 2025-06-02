
# Catering Menu Pro - WordPress Plugin

A complete WordPress plugin for catering businesses with order management and Elementor integration.

## Installation

1. Copy the `catering-menu-pro` folder to your WordPress `wp-content/plugins/` directory
2. Activate the plugin in WordPress admin
3. Build the React app for WordPress (see Build Instructions below)

## Build Instructions

To build the React app for WordPress:

1. Navigate to your React project root
2. Copy `build-config/vite.config.wordpress.js` to your project root as `vite.config.wordpress.js`
3. Run: `npm run build -- --config vite.config.wordpress.js`
4. Copy the generated `build` folder to the plugin directory

## Usage

### Shortcode
Use `[catering_menu]` in any page, post, or Elementor section to display the catering menu.

### Admin Features
- **Dashboard**: Quick stats and recent orders overview
- **Orders**: View and manage all customer orders
- **Menu Items**: View current menu items (database-driven)
- **Settings**: Configure email notifications and admin settings

### Order Management
- Orders are automatically saved to the database
- Email notifications sent to admin and customers
- Order status tracking (pending, processing, completed, cancelled)
- Order details modal with itemized breakdown

### Database Tables
- `wp_cmp_orders`: Stores all order data
- `wp_cmp_menu_items`: Stores menu items and pricing

## Features

✅ WordPress shortcode integration
✅ Elementor compatibility
✅ Order management system
✅ Email notifications
✅ Admin dashboard
✅ Database-driven menu items
✅ Order status tracking
✅ Responsive design
✅ Security with nonces
✅ REST API endpoints

## Customization

The plugin is designed to be easily customizable:
- Modify menu items directly in the database
- Extend admin interface for full menu management
- Add custom order fields
- Integrate with payment gateways
- Add custom email templates

## Support

For support and customization requests, contact the plugin developer.
