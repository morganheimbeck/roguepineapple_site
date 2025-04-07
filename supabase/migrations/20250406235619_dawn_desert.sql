/*
  # Initial Schema for Rogue Pineapple E-commerce

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `thumbnail_url` (text)
      - `image_url` (text)
      - `image_caption` (text)
      - `type` (text, either 'clothing' or 'engraving')
      - `tags` (text[], for searchable tags)
      - `effective_date` (timestamptz)
      - `expiration_date` (timestamptz)
      - `spotlight` (boolean)
      - `price` (numeric)
      - `sizes` (jsonb, for available sizes)
      - `printify_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on products table
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  image_url text,
  image_caption text,
  type text NOT NULL CHECK (type IN ('clothing', 'engraving')),
  tags text[],
  effective_date timestamptz NOT NULL DEFAULT now(),
  expiration_date timestamptz,
  spotlight boolean DEFAULT false,
  price numeric(10,2) NOT NULL,
  sizes jsonb,
  printify_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read effective products
CREATE POLICY "Public can view effective products" ON products
  FOR SELECT
  TO public
  USING (
    effective_date <= now() AND
    (expiration_date IS NULL OR expiration_date > now())
  );

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins have full access" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();