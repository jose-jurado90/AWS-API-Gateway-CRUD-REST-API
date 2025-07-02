import { DynamoDB } from 'aws-sdk';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/Product';

const dynamodb = new DynamoDB.DocumentClient();
const tableName = process.env.PRODUCTS_TABLE!;

export class ProductService {
  async create(productData: CreateProductRequest): Promise<Product> {
    const now = new Date().toISOString();
    const product: Product = {
      id: this.generateId(),
      ...productData,
      available: productData.available ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: tableName,
      Item: product,
    };

    await dynamodb.put(params).promise();
    return product;
  }

  async getById(id: string): Promise<Product | null> {
    const params = {
      TableName: tableName,
      Key: { id },
    };

    const result = await dynamodb.get(params).promise();
    return result.Item as Product || null;
  }

  async getAll(): Promise<Product[]> {
    const params = {
      TableName: tableName,
    };

    const result = await dynamodb.scan(params).promise();
    return result.Items as Product[] || [];
  }

  async update(id: string, updateData: UpdateProductRequest): Promise<Product | null> {
    // First check if the product exists
    const existingProduct = await this.getById(id);
    if (!existingProduct) {
      return null;
    }

    const now = new Date().toISOString();
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build dynamic update expression
    Object.entries(updateData).forEach(([key, value], index) => {
      if (value !== undefined) {
        const attributeName = `#attr${index}`;
        const attributeValue = `:val${index}`;
        
        updateExpression.push(`${attributeName} = ${attributeValue}`);
        expressionAttributeNames[attributeName] = key;
        expressionAttributeValues[attributeValue] = value;
      }
    });

    // Always update the updatedAt field
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = now;

    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const,
    };

    const result = await dynamodb.update(params).promise();
    return result.Attributes as Product;
  }

  async delete(id: string): Promise<boolean> {
    // First check if the product exists
    const existingProduct = await this.getById(id);
    if (!existingProduct) {
      return false;
    }

    const params = {
      TableName: tableName,
      Key: { id },
    };

    await dynamodb.delete(params).promise();
    return true;
  }

  private generateId(): string {
    return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const productService = new ProductService(); 