import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Pencil } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our unique collection of custom products and engravings
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div 
          onClick={() => navigate('/products/clothing')}
          className="bg-white rounded-lg shadow-md p-8 cursor-pointer transition-transform hover:scale-105"
        >
          <ShoppingBag className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Clothing</h2>
          <p className="text-gray-600">Browse our collection of custom apparel and accessories</p>
        </div>

        <div 
          onClick={() => navigate('/products/engraving')}
          className="bg-white rounded-lg shadow-md p-8 cursor-pointer transition-transform hover:scale-105"
        >
          <Pencil className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Engravings</h2>
          <p className="text-gray-600">Explore our personalized engraving services</p>
        </div>
      </div>
    </div>
  );
}

export default Home;