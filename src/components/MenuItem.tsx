
import { useState, useEffect } from 'react';
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
  onQuantityChange: (itemId: number, celebrationSize: 'small' | 'big', quantity: number, unitPrice: number) => void;
  orderItems: Record<string, any>;
}

const MenuItem = ({ item, onQuantityChange, orderItems }: MenuItemProps) => {
  const [celebrationSize, setCelebrationSize] = useState<'small' | 'big'>('small');
  const [quantities, setQuantities] = useState<{ small: number; big: number }>({ small: 0, big: 0 });

  const currentPrice = item.prices[celebrationSize];
  const currentQuantity = quantities[celebrationSize];

  // Initialize quantities from existing order items
  useEffect(() => {
    const smallKey = `${item.id}-small`;
    const bigKey = `${item.id}-big`;
    const smallOrder = orderItems[smallKey];
    const bigOrder = orderItems[bigKey];
    
    setQuantities({
      small: smallOrder?.quantity || 0,
      big: bigOrder?.quantity || 0
    });
  }, [item.id, orderItems]);

  // Use different placeholder images based on celebration size
  const getImageForSize = (baseImage: string, size: 'small' | 'big') => {
    if (size === 'big') {
      // For big celebrations, use a different placeholder image
      if (baseImage.includes('photo-1618160702438-9b02ab6515c9')) {
        return 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=250&fit=crop';
      } else if (baseImage.includes('photo-1465146344425-f00d5f5c8f07')) {
        return 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop';
      } else if (baseImage.includes('photo-1721322800607-8c38375eef04')) {
        return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop';
      }
    }
    return baseImage;
  };

  const currentImage = getImageForSize(item.image, celebrationSize);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, currentQuantity + delta);
    const newQuantities = { ...quantities, [celebrationSize]: newQuantity };
    setQuantities(newQuantities);
    onQuantityChange(item.id, celebrationSize, newQuantity, currentPrice);
  };

  const handleSizeChange = (newSize: 'small' | 'big') => {
    setCelebrationSize(newSize);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={currentImage}
          alt={`${item.name} - ${celebrationSize} celebrations`}
          className="w-full h-48 object-cover transition-all duration-300"
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
              onClick={() => handleSizeChange('small')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                celebrationSize === 'small'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Small Celebrations
            </button>
            <button
              onClick={() => handleSizeChange('big')}
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
              disabled={currentQuantity <= 0}
            >
              <Minus size={16} className={currentQuantity <= 0 ? 'text-gray-300' : 'text-gray-600'} />
            </button>
            <span className="font-medium text-lg w-8 text-center">{currentQuantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-medium text-gray-600">
              ${currentPrice.toFixed(2)} each
            </div>
            {currentQuantity > 0 && (
              <div className="text-xl font-bold text-orange-600">
                Total: ${(currentPrice * currentQuantity).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
