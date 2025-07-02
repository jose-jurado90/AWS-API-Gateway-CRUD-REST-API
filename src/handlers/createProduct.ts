import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';
import { productService } from '../utils/dynamodb';
import { validateCreateProductRequest, ValidationError } from '../utils/validation';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Create Product - Event:', JSON.stringify(event, null, 2));

  try {
    if (!event.body) {
      return createErrorResponse(400, 'BAD_REQUEST', 'Request body is required');
    }

    const requestData = JSON.parse(event.body);
    const validatedData = validateCreateProductRequest(requestData);
    
    const product = await productService.create(validatedData);
    
    console.log('Product created successfully:', product);
    
    return createSuccessResponse(201, product, 'Product created successfully');
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof ValidationError) {
      return createErrorResponse(400, 'VALIDATION_ERROR', error.message);
    }
    
    if (error instanceof SyntaxError) {
      return createErrorResponse(400, 'INVALID_JSON', 'Invalid JSON in request body');
    }
    
    return createErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while creating the product'
    );
  }
}; 