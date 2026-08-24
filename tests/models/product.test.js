const { Product, Category } = require('../../src/models/product');
const { sequelize } = require('../../src/database/connection');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {


  
  describe('Product Creation', () => {
    test('should create a product and assert that it exists', () => {
      const productData = {
        name: 'Fedora',
        description: 'A red hat',
        price: 12.50,
        available: true,
        category: Category.CLOTHS
      };
      
      const product = new Product(productData);
      
      expect(product).toBeDefined();
      expect(product.id).toBeNull(); // Not saved yet
      expect(product.name).toBe('Fedora');
      expect(product.description).toBe('A red hat');
      expect(product.available).toBe(true);
      expect(product.price).toBe(12.50);
      expect(product.category).toBe(Category.CLOTHS);
    });
    
    test('should add a product to the database', async () => {
      // Check database is empty
      const products = await Product.findAll();
      expect(products).toEqual([]);
      
      // Create product using factory
      const productData = ProductFactory.build();
      delete productData.id; // Remove ID so database assigns one
      
      const product = await Product.create(productData);
      
      // Assert that it was assigned an id and shows up in the database
      expect(product.id).toBeDefined();
      
      const allProducts = await Product.findAll();
      expect(allProducts.length).toBe(1);
      
      // Check that it matches the original product
      const newProduct = allProducts[0];
      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.description).toBe(productData.description);
      expect(parseFloat(newProduct.price)).toBe(productData.price);
      expect(newProduct.available).toBe(productData.available);
      expect(newProduct.category).toBe(productData.category);
    });
  });
  
  //
   describe('Product Read/Update/Delete/List', () => {
    test('should read a product from the database', async () => {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);

      const foundProduct = await Product.findByPk(product.id);
      expect(foundProduct).not.toBeNull();
      expect(foundProduct.id).toBe(product.id);
      expect(foundProduct.name).toBe(product.name);
    });

    test('should update a product in the database', async () => {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);

      product.description = 'Updated description';
      await product.save();

      const updatedProduct = await Product.findByPk(product.id);
      expect(updatedProduct.description).toBe('Updated description');
    });

    test('should delete a product from the database', async () => {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);
      expect(await Product.findAll()).toHaveLength(1);

      await product.destroy();
      expect(await Product.findAll()).toHaveLength(0);
    });

    test('should list all products in the database', async () => {
      let products = await Product.findAll();
      expect(products).toHaveLength(0);

      for (let i = 0; i < 5; i++) {
        await Product.create(ProductFactory.build());
      }

      products = await Product.findAll();
      expect(products).toHaveLength(5);
    });

    test('should find a product by name', async () => {
      const created = [];
      for (let i = 0; i < 5; i++) {
        created.push(await Product.create(ProductFactory.build()));
      }
      const name = created[0].name;
      const count = created.filter(p => p.name === name).length;

      const found = await Product.findByName(name);
      expect(found).toHaveLength(count);
      found.forEach(product => expect(product.name).toBe(name));
    });

    test('should find products by category', async () => {
      const created = [];
      for (let i = 0; i < 10; i++) {
        created.push(await Product.create(ProductFactory.build()));
      }
      const category = created[0].category;
      const count = created.filter(p => p.category === category).length;

      const found = await Product.findByCategory(category);
      expect(found).toHaveLength(count);
      found.forEach(product => expect(product.category).toBe(category));
    });

    test('should find products by availability', async () => {
      const created = [];
      for (let i = 0; i < 10; i++) {
        created.push(await Product.create(ProductFactory.build()));
      }
      const availableCount = created.filter(p => p.available === true).length;

      const found = await Product.findByAvailability(true);
      expect(found).toHaveLength(availableCount);
      found.forEach(product => expect(product.available).toBe(true));
    });
  });
  //

  
  
});