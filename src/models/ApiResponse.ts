export interface ApiResponse<T = any> {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  body: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

export const createResponse = <T>(
  statusCode: number,
  data: SuccessResponse<T> | ErrorResponse
): ApiResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(data),
});

export const createSuccessResponse = <T>(
  statusCode: number = 200,
  data: T,
  message?: string
): ApiResponse => createResponse(statusCode, {
  success: true,
  data,
  message,
});

export const createErrorResponse = (
  statusCode: number,
  error: string,
  message: string
): ApiResponse => createResponse(statusCode, {
  success: false,
  error,
  message,
}); 