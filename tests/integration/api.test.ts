// Integration tests require a deployed API
// These tests will run against the actual AWS resources

const API_BASE_URL = process.env.API_ENDPOINT || 'http://localhost:3000/dev';

describe('Coffee Shop API Integration Tests', () => {
  let createdProductId: string;

  beforeAll(async () => {
    // Wait for API to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    // Cleanup: delete the created product if it exists
    if (createdProductId) {
      try {
        await fetch(`${API_BASE_URL}/products/${createdProductId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.warn('Failed to cleanup test product:', error);
      }
    }
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Integration Test Espresso',
        description: 'Test espresso for integration testing',
        price: 2.99,
        category: 'espresso',
        available: true,
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      expect(response.status).toBe(201);
      
      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(data.data).toMatchObject(productData);
      expect(data.data.id).toBeDefined();
      
      createdProductId = data.data.id;
    });

    it('should return 400 for invalid product data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        price: -1, // Invalid: negative price
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as any;
      expect(data.success).toBe(false);
      expect(data.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /products', () => {
    it('should return list of products', async () => {
      const response = await fetch(`${API_BASE_URL}/products`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('GET /products/{id}', () => {
    it('should return a specific product', async () => {
      if (!createdProductId) {
        // Create a product first
        const createResponse = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Product',
            description: 'Test description',
            price: 1.99,
            category: 'coffee',
          }),
        });
        const createData = await createResponse.json();
        createdProductId = createData.data.id;
      }

      const response = await fetch(`${API_BASE_URL}/products/${createdProductId}`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(createdProductId);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await fetch(`${API_BASE_URL}/products/non-existent-id`);
      
      expect(response.status).toBe(404);
      
      const data = await response.json() as any;
      expect(data.success).toBe(false);
      expect(data.error).toBe('NOT_FOUND');
    });
  });

  describe('PUT /products/{id}', () => {
    it('should update an existing product', async () => {
      if (!createdProductId) {
        // Create a product first
        const createResponse = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Product',
            description: 'Test description',
            price: 1.99,
            category: 'coffee',
          }),
        });
        const createData = await createResponse.json();
        createdProductId = createData.data.id;
      }

      const updateData = {
        name: 'Updated Test Product',
        price: 2.49,
      };

      const response = await fetch(`${API_BASE_URL}/products/${createdProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      
      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(updateData.name);
      expect(data.data.price).toBe(updateData.price);
    });
  });

  describe('DELETE /products/{id}', () => {
    it('should delete an existing product', async () => {
      // Create a product to delete
      const createResponse = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Product To Delete',
          description: 'This will be deleted',
          price: 1.00,
          category: 'coffee',
        }),
      });
      const createData = await createResponse.json() as any;
      const productToDelete = createData.data.id;

      const response = await fetch(`${API_BASE_URL}/products/${productToDelete}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);
      
      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(productToDelete);

      // Verify the product is actually deleted
      const getResponse = await fetch(`${API_BASE_URL}/products/${productToDelete}`);
      expect(getResponse.status).toBe(404);
    });
  });
}); 