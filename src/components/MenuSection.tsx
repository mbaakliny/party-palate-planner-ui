
import MenuItem from './MenuItem';

interface MenuSectionProps {
  title: string;
  items: Array<{
    id: number;
    name: string;
    description: string;
    image: string;
    prices: { small: number; big: number };
    vegan: boolean;
  }>;
  onQuantityChange: (itemId: number, celebrationSize: 'small' | 'big', quantity: number, unitPrice: number) => void;
  orderItems: Record<string, any>;
}

const MenuSection = ({ title, items, onQuantityChange, orderItems }: MenuSectionProps) => {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
          {items.length} items
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            orderItems={orderItems}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
