
jQuery(document).ready(function($) {
    // Order details modal
    $('.view-order-details').on('click', function(e) {
        e.preventDefault();
        var orderData = $(this).data('order');
        
        // Create modal content
        var modalContent = '<div class="cmp-order-modal">';
        modalContent += '<h3>Order #' + orderData.id + '</h3>';
        modalContent += '<p><strong>Date:</strong> ' + orderData.created_at + '</p>';
        modalContent += '<p><strong>Total:</strong> $' + orderData.total_amount + '</p>';
        modalContent += '<p><strong>Status:</strong> ' + orderData.status + '</p>';
        
        if (orderData.customer_name) {
            modalContent += '<p><strong>Customer:</strong> ' + orderData.customer_name + '</p>';
        }
        if (orderData.customer_email) {
            modalContent += '<p><strong>Email:</strong> ' + orderData.customer_email + '</p>';
        }
        if (orderData.customer_phone) {
            modalContent += '<p><strong>Phone:</strong> ' + orderData.customer_phone + '</p>';
        }
        
        modalContent += '<h4>Order Items:</h4>';
        modalContent += '<ul>';
        var items = JSON.parse(orderData.order_data);
        items.forEach(function(item) {
            modalContent += '<li>' + item.itemName + ' (' + item.celebrationSize + ') x' + item.quantity + ' = $' + item.totalPrice.toFixed(2) + '</li>';
        });
        modalContent += '</ul>';
        modalContent += '</div>';
        
        // Show in WordPress admin modal (you can enhance this)
        alert('Order Details:\n\n' + $(modalContent).text());
    });
    
    // Status update
    $('.cmp-status-select').on('change', function() {
        var orderId = $(this).data('order-id');
        var newStatus = $(this).val();
        
        $.post(ajaxurl, {
            action: 'update_order_status',
            order_id: orderId,
            status: newStatus,
            nonce: cmpAdmin.nonce
        }, function(response) {
            if (response.success) {
                location.reload();
            } else {
                alert('Failed to update status');
            }
        });
    });
});
