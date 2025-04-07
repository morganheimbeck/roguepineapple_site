import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PlusCircle, Package, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  image_url: string | null;
  type: 'clothing' | 'engraving';
  tags: string[] | null;
  price: number;
  effective_date: string;
  expiration_date: string | null;
  spotlight: boolean;
  sizes: Record<string, string[]> | null;
  printify_url: string | null;
}

function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin/products');
    } else {
      toast.error('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching products');
      return;
    }

    setProducts(data || []);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                {product.thumbnail_url && (
                  <img
                    src={product.thumbnail_url}
                    alt={product.title}
                    className="h-16 w-16 object-cover rounded-md mr-4"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.type} - ${product.price}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    thumbnail_url: '',
    image_url: '',
    type: 'clothing',
    tags: [],
    price: 0,
    spotlight: false,
    printify_url: '',
    sizes: null,
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [isEditing]);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Error fetching product');
      return;
    }

    if (data) {
      setFormData(data);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = isEditing
      ? await supabase
          .from('products')
          .update(formData)
          .eq('id', id)
      : await supabase
          .from('products')
          .insert([formData]);

    if (error) {
      toast.error('Error saving product');
      return;
    }

    toast.success('Product saved successfully');
    navigate('/admin/products');
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEditing ? 'Edit Product' : 'New Product'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Enter the product details below.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'clothing' | 'engraving' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="clothing">Clothing</option>
                <option value="engraving">Engraving</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail_url || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="e.g., summer, vintage, new"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Printify URL
              </label>
              <input
                type="url"
                value={formData.printify_url || ''}
                onChange={(e) => setFormData({ ...formData, printify_url: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.spotlight || false}
                onChange={(e) => setFormData({ ...formData, spotlight: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Product
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/admin/products" className="flex items-center px-4 text-gray-900">
                <Package className="h-6 w-6 mr-2" />
                Products
              </Link>
              <Link to="/admin/settings" className="flex items-center px-4 text-gray-900">
                <Settings className="h-6 w-6 mr-2" />
                Settings
              </Link>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('isAdminAuthenticated');
                navigate('/admin');
              }}
              className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<Login />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="settings" element={<div>Settings</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default function Admin() {
  return <AdminLayout />;
}