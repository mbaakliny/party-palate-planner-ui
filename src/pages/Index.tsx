
import { useState } from 'react';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import MenuSection from '../components/MenuSection';

const Index = () => {
  const [cartItems, setCartItems] = useState([]);

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

  const addToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    console.log('Added to cart:', item);
  };

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
            onAddToCart={addToCart}
          />
        ))}
      </main>
      
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
