import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';
import { productService } from '../utils/dynamodb';
import { validateProductId, validateUpdateProductRequest, ValidationError } from '../utils/validation';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Update Product - Event:', JSON.stringify(event, null, 2));

  try {
    const productId = event.pathParameters?.id;
    
    if (!productId) {
      return createErrorResponse(400, 'BAD_REQUEST', 'Product ID is required');
    }

    if (!event.body) {
      return createErrorResponse(400, 'BAD_REQUEST', 'Request body is required');
    }

    const validatedId = validateProductId(productId);
    const requestData = JSON.parse(event.body);
    const validatedData = validateUpdateProductRequest(requestData);
    
    const updatedProduct = await productService.update(validatedId, validatedData);
    
    if (!updatedProduct) {
      return createErrorResponse(404, 'NOT_FOUND', 'Product not found');
    }
    
    console.log('Product updated successfully:', updatedProduct);
    
    return createSuccessResponse(200, updatedProduct, 'Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error instanceof ValidationError) {
      return createErrorResponse(400, 'VALIDATION_ERROR', error.message);
    }
    
    if (error instanceof SyntaxError) {
      return createErrorResponse(400, 'INVALID_JSON', 'Invalid JSON in request body');
    }
    
    return createErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while updating the product'
    );
  }
}; 