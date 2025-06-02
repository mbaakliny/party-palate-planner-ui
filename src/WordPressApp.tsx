import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import OrderSummaryModal from './components/OrderSummaryModal';

interface OrderItem {
  itemId: number;
  itemName: string;
  celebrationSize: 'small' | 'big';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  prices: { small: number; big: number };
  vegan: boolean;
}

interface WordPressData {
  ajaxUrl: string;
  nonce: string;
  apiUrl: string;
  restNonce: string;
}

declare global {
  interface Window {
    cateringMenuData: WordPressData;
  }
}

const WordPressApp = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch menu data from WordPress API
    const fetchMenuData = async () => {
      try {
        const response = await fetch(window.cateringMenuData.apiUrl + 'menu-items');
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
        // Fallback to static data if API fails
        setMenuData({
          "Party Pastries": [
            {
              id: 1,
              name: "Classic Meat Pies",
              description: "Traditional beef pies with flaky pastry",
              image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
              prices: { small: 15.00, big: 25.00 },
              vegan: false
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (window.cateringMenuData) {
      fetchMenuData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleQuantityChange = (itemId: number, celebrationSize: 'small' | 'big', quantity: number, unitPrice: number) => {
    const key = `${itemId}-${celebrationSize}`;
    const item = Object.values(menuData).flat().find((item: MenuItem) => item.id === itemId);
    
    if (quantity === 0) {
      setOrderItems(prev => {
        const newItems = { ...prev };
        delete newItems[key];
        return newItems;
      });
    } else {
      setOrderItems(prev => ({
        ...prev,
        [key]: {
          itemId,
          itemName: item?.name || '',
          celebrationSize,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice
        }
      }));
    }
  };

  const handleRemoveItem = (itemId: number, celebrationSize: 'small' | 'big') => {
    const key = `${itemId}-${celebrationSize}`;
    setOrderItems(prev => {
      const newItems = { ...prev };
      delete newItems[key];
      return newItems;
    });
  };

  const handleSendOrderRequest = async () => {
    const orderList = Object.values(orderItems);
    
    if (orderList.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add items to your order before sending the request.",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = orderList.reduce((sum, item) => sum + item.totalPrice, 0);
    
    const orderData = {
      items: orderList,
      total_amount: totalAmount,
      customer_email: '',
      customer_phone: '',
      customer_name: ''
    };

    try {
      // Submit order via WordPress REST API
      const response = await fetch(window.cateringMenuData.apiUrl + 'submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.cateringMenuData.restNonce
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success !== false) {
        toast({
          title: "Order Request Sent!",
          description: `Your order with ${orderList.length} items (Total: $${totalAmount.toFixed(2)}) has been submitted.`
        });
        setOrderItems({});
      } else {
        throw new Error(result.message || 'Order submission failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const orderList = Object.values(orderItems);
  const totalAmount = orderList.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = orderList.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className="text-center py-8">Loading menu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <main className="container mx-auto px-4 py-8">
        {Object.entries(menuData).map(([category, items]) => (
          <MenuSection
            key={category}
            title={category}
            items={items}
            onQuantityChange={handleQuantityChange}
            orderItems={orderItems}
          />
        ))}

        {orderList.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t-2 border-orange-500 shadow-lg p-6 mt-16">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-800">
                    Order Summary: {totalItems} items
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    Total: ${totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setIsOrderModalOpen(true)}
                    variant="outline"
                    size="lg"
                    className="font-semibold px-8 py-3"
                  >
                    View Order
                  </Button>
                  <Button 
                    onClick={handleSendOrderRequest}
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3"
                  >
                    Send Order Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <OrderSummaryModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderItems={orderItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default WordPressApp;
