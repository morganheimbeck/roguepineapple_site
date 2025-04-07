import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Rogue Pineapple</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname.startsWith('/products')
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Products
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full sm:w-64 px-4 py-2 pl-10 pr-4 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}