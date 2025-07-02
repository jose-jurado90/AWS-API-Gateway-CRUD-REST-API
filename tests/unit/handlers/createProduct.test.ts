import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../src/handlers/createProduct';
import { productService } from '../../../src/utils/dynamodb';

// Mock the productService
jest.mock('../../../src/utils/dynamodb');
const mockProductService = productService as jest.Mocked<typeof productService>;

describe('createProduct handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockEvent = (body: string): APIGatewayProxyEvent => ({
    body,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/products',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  });

  it('should create a product successfully', async () => {
    const productData = {
      name: 'Espresso',
      description: 'Strong coffee',
      price: 3.50,
      category: 'espresso',
    };

    const mockProduct = {
      id: 'product_123',
      ...productData,
      available: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };

    mockProductService.create.mockResolvedValue(mockProduct);

    const event = createMockEvent(JSON.stringify(productData));
    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({
      success: true,
      data: mockProduct,
      message: 'Product created successfully',
    });
    expect(mockProductService.create).toHaveBeenCalledWith(productData);
  });

  it('should return 400 for missing body', async () => {
    const event = createMockEvent('');
    event.body = null;
    
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'BAD_REQUEST',
      message: 'Request body is required',
    });
  });

  it('should return 400 for invalid JSON', async () => {
    const event = createMockEvent('invalid json');
    
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'INVALID_JSON',
      message: 'Invalid JSON in request body',
    });
  });

  it('should return 400 for missing required fields', async () => {
    const invalidData = {
      name: 'Espresso',
      // missing description, price, category
    };

    const event = createMockEvent(JSON.stringify(invalidData));
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).success).toBe(false);
    expect(JSON.parse(result.body).error).toBe('VALIDATION_ERROR');
  });
}); 