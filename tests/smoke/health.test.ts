// Smoke tests for production health checks
// These are basic tests to ensure the API is responding correctly

const SMOKE_API_BASE_URL = process.env.API_ENDPOINT || 'https://api.example.com/prod';

describe('Production Smoke Tests', () => {
  const timeout = 30000; // 30 seconds timeout for production

  describe('API Health Check', () => {
    it('should respond to GET /products', async () => {
      const response = await fetch(`${SMOKE_API_BASE_URL}/products`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      expect(response.status).toBe(200);
      
      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    }, timeout);

    it('should handle 404 for non-existent product gracefully', async () => {
      const response = await fetch(`${SMOKE_API_BASE_URL}/products/non-existent-product-id`);
      
      expect(response.status).toBe(404);
      
      const data = await response.json() as any;
      expect(data.success).toBe(false);
      expect(data.error).toBe('NOT_FOUND');
    }, timeout);

    it('should validate required fields for POST requests', async () => {
      const response = await fetch(`${SMOKE_API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body should fail validation
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as any;
      expect(data.success).toBe(false);
      expect(data.error).toBe('VALIDATION_ERROR');
    }, timeout);
  });

  describe('CORS Headers', () => {
    it('should include proper CORS headers', async () => {
      const response = await fetch(`${SMOKE_API_BASE_URL}/products`);
      
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    }, timeout);
  });

  describe('Response Format', () => {
    it('should return consistent response format', async () => {
      const response = await fetch(`${SMOKE_API_BASE_URL}/products`);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('application/json');
      
      const data = await response.json() as any;
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(typeof data.success).toBe('boolean');
    }, timeout);
  });
});