import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  price: number;
  type: string;
  tags: string[] | null;
  printify_url: string | null;
}

export default function Products() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase
          .from('products')
          .select('*');

        if (category) {
          query = query.eq('type', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
      </h1>
      
      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.thumbnail_url && (
                <img
                  src={product.thumbnail_url}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                {product.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {product.printify_url && (
                  <a
                    href={product.printify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Buy Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}