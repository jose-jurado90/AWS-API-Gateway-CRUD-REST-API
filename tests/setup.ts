// Global test setup
process.env.PRODUCTS_TABLE = 'test-products-table';
process.env.STAGE = 'test';
process.env.AWS_REGION = 'us-east-1';

// Mock AWS SDK
jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    scan: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };

  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
  };
}); 