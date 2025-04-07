// printify.js
require('dotenv').config();
const superagent = require('superagent');

const API_BASE_URL = 'https://api.printify.com/v1';
const API_KEY = process.env.PRINTIFY_API_KEY || 'your_api_key_here';

function request(method, endpoint) {
  return superagent(method, `${API_BASE_URL}${endpoint}`)
    .set('Authorization', `Bearer ${API_KEY}`)
    .set('Content-Type', 'application/json');
}

const PrintifyAPI = {
  getShops: async () => {
    const res = await request('GET', '/shops.json');
    return res.body;
  },

  getProducts: async (shopId) => {
    const res = await request('GET', `/shops/${shopId}/products.json`);
    return res.body;
  },

  getProduct: async (shopId, productId) => {
    const res = await request(
      'GET',
      `/shops/${shopId}/products/${productId}.json`
    );
    return res.body;
  },

  // Add more methods as needed
};

module.exports = PrintifyAPI;
