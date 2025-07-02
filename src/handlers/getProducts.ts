import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';
import { productService } from '../utils/dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Get Products - Event:', JSON.stringify(event, null, 2));

  try {
    const products = await productService.getAll();
    
    console.log(`Retrieved ${products.length} products successfully`);
    
    return createSuccessResponse(
      200,
      products,
      `Retrieved ${products.length} products successfully`
    );
  } catch (error) {
    console.error('Error retrieving products:', error);
    
    return createErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while retrieving products'
    );
  }
}; 