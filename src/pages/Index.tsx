import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import MenuSection from '../components/MenuSection';
import OrderSummaryModal from '../components/OrderSummaryModal';

interface OrderItem {
  itemId: number;
  itemName: string;
  celebrationSize: 'small' | 'big';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const Index = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { toast } = useToast();

  const menuData = {
    "Party Pastries": [
      {
        id: 1,
        name: "Classic Meat Pies",
        description: "Traditional beef pies with flaky pastry",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
        prices: { small: 15.00, big: 25.00 },
        vegan: false
      },
      {
        id: 2,
        name: "Spinach",
        description: "Fresh spinach pastries with feta cheese",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
        prices: { small: 12.50, big: 22.50 },
        vegan: false
      },
      {
        id: 3,
        name: "Plant Vegan",
        description: "Delicious plant-based pastries",
        image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
        prices: { small: 14.50, big: 24.50 },
        vegan: true
      }
    ],
    "Salads & Dips": [
      {
        id: 4,
        name: "Greek Salad",
        description: "Fresh tomatoes, olives, feta cheese",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
        prices: { small: 18.00, big: 32.00 },
        vegan: false
      },
      {
        id: 5,
        name: "Hummus",
        description: "Traditional chickpea hummus with tahini",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
        prices: { small: 9.50, big: 16.50 },
        vegan: true
      },
      {
        id: 6,
        name: "Garden Salad",
        description: "Mixed greens with seasonal vegetables",
        image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
        prices: { small: 15.00, big: 28.00 },
        vegan: true
      }
    ],
    "Platters & Wraps": [
      {
        id: 7,
        name: "Chicken Mediterranean",
        description: "Grilled chicken with Mediterranean herbs",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
        prices: { small: 25.00, big: 45.00 },
        vegan: false
      },
      {
        id: 8,
        name: "Vegetarian Delight",
        description: "Fresh vegetables with hummus wrap",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
        prices: { small: 19.50, big: 35.00 },
        vegan: true
      },
      {
        id: 9,
        name: "Mixed Platter",
        description: "Assorted meats and cheeses",
        image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
        prices: { small: 28.00, big: 52.00 },
        vegan: false
      }
    ]
  };

  const handleQuantityChange = (itemId: number, celebrationSize: 'small' | 'big', quantity: number, unitPrice: number) => {
    const key = `${itemId}-${celebrationSize}`;
    const item = Object.values(menuData).flat().find(item => item.id === itemId);
    
    if (quantity === 0) {
      // Remove item from order if quantity is 0
      setOrderItems(prev => {
        const newItems = { ...prev };
        delete newItems[key];
        return newItems;
      });
    } else {
      // Add or update item in order
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

  const handleSendOrderRequest = () => {
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
    
    console.log('Order Request:', {
      items: orderList,
      totalAmount,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Order Request Sent!",
      description: `Your order with ${orderList.length} items (Total: $${totalAmount.toFixed(2)}) has been submitted.`
    });

    // Reset the order
    setOrderItems({});
  };

  const orderList = Object.values(orderItems);
  const totalAmount = orderList.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = orderList.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
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

        {/* Order Summary and Send Button */}
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
      
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Café Co</h3>
              <p className="text-gray-400">Premium catering services for all occasions</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Menu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
              <p className="text-gray-400">Email: info@cafeco.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
