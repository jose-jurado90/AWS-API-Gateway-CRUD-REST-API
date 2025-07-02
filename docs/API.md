# Coffee Shop API Documentation

## Overview

The Coffee Shop API is a RESTful service that provides complete CRUD operations for managing coffee shop products. Built on AWS serverless architecture using API Gateway, Lambda, and DynamoDB.

## Base URLs

- **Development**: `https://{api-id}.execute-api.us-east-1.amazonaws.com/dev`
- **Production**: `https://{api-id}.execute-api.us-east-1.amazonaws.com/prod`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Request/Response Format

All requests and responses use JSON format.

### Successful Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Detailed error message"
}
```

## Product Model

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Product Categories

- `espresso` - Espresso-based drinks
- `coffee` - Regular coffee
- `latte` - Latte variations
- `cappuccino` - Cappuccino variations
- `frappuccino` - Blended drinks
- `tea` - Tea beverages
- `pastry` - Pastries and baked goods
- `sandwich` - Sandwiches and food items

## API Endpoints

### Create Product

Create a new product in the coffee shop inventory.

**Endpoint:** `POST /products`

**Request Body:**
```json
{
  "name": "Espresso",
  "description": "Rich and bold espresso shot",
  "price": 2.50,
  "category": "espresso",
  "available": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "product_1699123456789_abc123",
    "name": "Espresso",
    "description": "Rich and bold espresso shot",
    "price": 2.50,
    "category": "espresso",
    "available": true,
    "createdAt": "2023-11-04T10:30:00.000Z",
    "updatedAt": "2023-11-04T10:30:00.000Z"
  },
  "message": "Product created successfully"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `description`: Required, non-empty string
- `price`: Required, positive number
- `category`: Required, must be one of the valid categories
- `available`: Optional, boolean (defaults to true)

---

### Get All Products

Retrieve all products from the coffee shop inventory.

**Endpoint:** `GET /products`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "product_1699123456789_abc123",
      "name": "Espresso",
      "description": "Rich and bold espresso shot",
      "price": 2.50,
      "category": "espresso",
      "available": true,
      "createdAt": "2023-11-04T10:30:00.000Z",
      "updatedAt": "2023-11-04T10:30:00.000Z"
    }
  ],
  "message": "Retrieved 1 products successfully"
}
```

---

### Get Product by ID

Retrieve a specific product by its ID.

**Endpoint:** `GET /products/{id}`

**Path Parameters:**
- `id`: The unique identifier of the product

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "product_1699123456789_abc123",
    "name": "Espresso",
    "description": "Rich and bold espresso shot",
    "price": 2.50,
    "category": "espresso",
    "available": true,
    "createdAt": "2023-11-04T10:30:00.000Z",
    "updatedAt": "2023-11-04T10:30:00.000Z"
  },
  "message": "Product retrieved successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Product not found"
}
```

---

### Update Product

Update an existing product. Only provided fields will be updated.

**Endpoint:** `PUT /products/{id}`

**Path Parameters:**
- `id`: The unique identifier of the product

**Request Body:**
```json
{
  "name": "Double Espresso",
  "price": 3.00
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "product_1699123456789_abc123",
    "name": "Double Espresso",
    "description": "Rich and bold espresso shot",
    "price": 3.00,
    "category": "espresso",
    "available": true,
    "createdAt": "2023-11-04T10:30:00.000Z",
    "updatedAt": "2023-11-04T10:45:00.000Z"
  },
  "message": "Product updated successfully"
}
```

**Validation Rules:**
- At least one field must be provided
- Same validation rules as create apply to provided fields

---

### Delete Product

Delete a product from the inventory.

**Endpoint:** `DELETE /products/{id}`

**Path Parameters:**
- `id`: The unique identifier of the product

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "product_1699123456789_abc123"
  },
  "message": "Product deleted successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Product not found"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request format or missing required data |
| `VALIDATION_ERROR` | 400 | Request data failed validation |
| `INVALID_JSON` | 400 | Request body contains invalid JSON |
| `NOT_FOUND` | 404 | Requested resource was not found |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## CORS Support

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Credentials: true`

## Rate Limiting

API Gateway has built-in throttling limits:
- Default: 10,000 requests per second
- Burst: 5,000 requests

## Examples

### Using curl

**Create a product:**
```bash
curl -X POST https://api.example.com/dev/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cappuccino",
    "description": "Espresso with steamed milk and foam",
    "price": 4.50,
    "category": "cappuccino"
  }'
```

**Get all products:**
```bash
curl https://api.example.com/dev/products
```

**Update a product:**
```bash
curl -X PUT https://api.example.com/dev/products/product_123 \
  -H "Content-Type: application/json" \
  -d '{"price": 4.75}'
```

### Using JavaScript/Fetch

```javascript
// Create a product
const response = await fetch('/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: 4.75,
    category: 'latte',
  }),
});

const result = await response.json();
```

## Changelog

### v1.0.0 (2023-11-04)
- Initial release
- Complete CRUD operations for products
- Input validation and error handling
- Multi-environment support 