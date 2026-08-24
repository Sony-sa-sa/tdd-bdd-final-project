const { faker } = require('@faker-js/faker');
const { Product, Category } = require('../src/models/product');

class ProductFactory {
  static build(overrides = {}) {
    const categories = Object.values(Category).filter(c => c !== Category.UNKNOWN);
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 2 })),
      available: faker.datatype.boolean(),
      category: faker.helpers.arrayElement(categories),
      ...overrides
    };
  }
}

module.exports = { ProductFactory };