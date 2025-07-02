import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';
import { productService } from '../utils/dynamodb';
import { validateProductId, ValidationError } from '../utils/validation';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Get Product - Event:', JSON.stringify(event, null, 2));

  try {
    const productId = event.pathParameters?.id;
    
    if (!productId) {
      return createErrorResponse(400, 'BAD_REQUEST', 'Product ID is required');
    }

    const validatedId = validateProductId(productId);
    const product = await productService.getById(validatedId);
    
    if (!product) {
      return createErrorResponse(404, 'NOT_FOUND', 'Product not found');
    }
    
    console.log('Product retrieved successfully:', product);
    
    return createSuccessResponse(200, product, 'Product retrieved successfully');
  } catch (error) {
    console.error('Error retrieving product:', error);
    
    if (error instanceof ValidationError) {
      return createErrorResponse(400, 'VALIDATION_ERROR', error.message);
    }
    
    return createErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while retrieving the product'
    );
  }
}; 