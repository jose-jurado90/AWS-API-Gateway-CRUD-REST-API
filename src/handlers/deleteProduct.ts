import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';
import { productService } from '../utils/dynamodb';
import { validateProductId, ValidationError } from '../utils/validation';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Delete Product - Event:', JSON.stringify(event, null, 2));

  try {
    const productId = event.pathParameters?.id;
    
    if (!productId) {
      return createErrorResponse(400, 'BAD_REQUEST', 'Product ID is required');
    }

    const validatedId = validateProductId(productId);
    const deleted = await productService.delete(validatedId);
    
    if (!deleted) {
      return createErrorResponse(404, 'NOT_FOUND', 'Product not found');
    }
    
    console.log('Product deleted successfully:', validatedId);
    
    return createSuccessResponse(200, { id: validatedId }, 'Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error instanceof ValidationError) {
      return createErrorResponse(400, 'VALIDATION_ERROR', error.message);
    }
    
    return createErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while deleting the product'
    );
  }
}; 