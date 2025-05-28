
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from 'lucide-react';

interface OrderItem {
  itemId: number;
  itemName: string;
  celebrationSize: 'small' | 'big';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: Record<string, OrderItem>;
  onQuantityChange: (itemId: number, celebrationSize: 'small' | 'big', quantity: number, unitPrice: number) => void;
  onRemoveItem: (itemId: number, celebrationSize: 'small' | 'big') => void;
}

const OrderSummaryModal = ({ 
  isOpen, 
  onClose, 
  orderItems, 
  onQuantityChange, 
  onRemoveItem 
}: OrderSummaryModalProps) => {
  const orderList = Object.values(orderItems);
  const totalAmount = orderList.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleQuantityChange = (item: OrderItem, delta: number) => {
    const newQuantity = Math.max(0, item.quantity + delta);
    onQuantityChange(item.itemId, item.celebrationSize, newQuantity, item.unitPrice);
  };

  const handleRemoveItem = (item: OrderItem) => {
    onRemoveItem(item.itemId, item.celebrationSize);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Order Summary</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {orderList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items in your order</p>
          ) : (
            orderList.map((item) => (
              <div key={`${item.itemId}-${item.celebrationSize}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.itemName}</h4>
                  <p className="text-sm text-gray-600 capitalize">{item.celebrationSize} Celebrations</p>
                  <p className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                    </button>
                    <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-orange-600">${item.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="w-8 h-8 rounded-full border border-red-300 flex items-center justify-center hover:bg-red-50 transition-colors text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
          
          {orderList.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-orange-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Continue Shopping
          </Button>
          {orderList.length > 0 && (
            <Button 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={onClose}
            >
              Update Order
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSummaryModal;
