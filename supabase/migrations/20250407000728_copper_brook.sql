/*
  # Add example products and enhance products table

  1. Changes
    - Add example clothing product
    - Add example engraving product
*/

-- Insert example clothing product
INSERT INTO products (
  title,
  description,
  thumbnail_url,
  image_url,
  type,
  tags,
  price,
  sizes,
  printify_url
) VALUES (
  'Vintage Pineapple T-Shirt',
  'Classic cotton t-shirt featuring our signature vintage pineapple design',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
  'clothing',
  ARRAY['t-shirt', 'vintage', 'pineapple'],
  24.99,
  '{"sizes": ["S", "M", "L", "XL", "2XL"]}',
  'https://printify.com/example-shirt'
);

-- Insert example engraving product
INSERT INTO products (
  title,
  description,
  thumbnail_url,
  image_url,
  type,
  tags,
  price,
  printify_url
) VALUES (
  'Custom Wooden Cutting Board',
  'Personalized wooden cutting board with laser-etched design',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200',
  'engraving',
  ARRAY['kitchen', 'wood', 'personalized'],
  39.99,
  'https://printify.com/example-board'
);