
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus } from 'lucide-react';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    image: string;
    prices: { small: number; big: number };
    vegan: boolean;
  };
  onAddToCart: (item: any) => void;
}

const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  const [celebrationSize, setCelebrationSize] = useState<'small' | 'big'>('small');
  const [quantity, setQuantity] = useState(1);

  const currentPrice = item.prices[celebrationSize];
  const totalPrice = currentPrice * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      celebrationSize,
      quantity,
      unitPrice: currentPrice,
      totalPrice
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        {item.vegan && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Vegan
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        {/* Celebration Size Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Celebration Size
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setCelebrationSize('small')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                celebrationSize === 'small'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Small Celebrations
            </button>
            <button
              onClick={() => setCelebrationSize('big')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                celebrationSize === 'big'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Big Celebrations
            </button>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={16} className={quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
            </button>
            <span className="font-medium text-lg w-8 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              ${totalPrice.toFixed(2)}
            </div>
            {quantity > 1 && (
              <div className="text-sm text-gray-500">
                ${currentPrice.toFixed(2)} each
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2"
        >
          Continue Order
        </Button>
      </div>
    </div>
  );
};

export default MenuItem;
