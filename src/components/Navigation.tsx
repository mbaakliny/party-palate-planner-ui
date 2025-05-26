
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-orange-600">Café Co</h2>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Menu</a>
            <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <ShoppingCart size={18} />
              Cart (0)
            </Button>
            
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Menu</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
              <Button variant="outline" size="sm" className="flex items-center gap-2 w-fit">
                <ShoppingCart size={18} />
                Cart (0)
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
