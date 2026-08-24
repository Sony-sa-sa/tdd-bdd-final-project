const { Given } = require('@cucumber/cucumber');
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/products';

Given('the following products', async function (dataTable) {
  // Clear existing products first to ensure a clean state
  try {
    const response = await axios.get(API_URL);
    const existingProducts = response.data;
    for (const product of existingProducts) {
      if (product.id) {
        await axios.delete(`${API_URL}/${product.id}`);
      }
    }
  } catch (error) {
    console.warn('Could not clear existing products, proceeding with creation:', error.message);
  }

  const products = dataTable.hashes();
  for (const product of products) {
    await axios.post(API_URL, {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      available: product.available === 'True',
      category: product.category
    });
  }
});
