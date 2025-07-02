import { CreateProductRequest, UpdateProductRequest, ProductCategory } from '../models/Product';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateCreateProductRequest = (data: any): CreateProductRequest => {
  if (!data) {
    throw new ValidationError('Request body is required');
  }

  const { name, description, price, category, available } = data;

  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name is required and must be a string');
  }

  if (!description || typeof description !== 'string') {
    throw new ValidationError('Description is required and must be a string');
  }

  if (typeof price !== 'number' || price < 0) {
    throw new ValidationError('Price is required and must be a positive number');
  }

  if (!category || typeof category !== 'string') {
    throw new ValidationError('Category is required and must be a string');
  }

  if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
    throw new ValidationError(`Category must be one of: ${Object.values(ProductCategory).join(', ')}`);
  }

  if (available !== undefined && typeof available !== 'boolean') {
    throw new ValidationError('Available must be a boolean');
  }

  return {
    name: name.trim(),
    description: description.trim(),
    price,
    category,
    available,
  };
};

export const validateUpdateProductRequest = (data: any): UpdateProductRequest => {
  if (!data || Object.keys(data).length === 0) {
    throw new ValidationError('At least one field is required for update');
  }

  const { name, description, price, category, available } = data;
  const updateData: UpdateProductRequest = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new ValidationError('Name must be a non-empty string');
    }
    updateData.name = name.trim();
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      throw new ValidationError('Description must be a non-empty string');
    }
    updateData.description = description.trim();
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      throw new ValidationError('Price must be a positive number');
    }
    updateData.price = price;
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || !Object.values(ProductCategory).includes(category as ProductCategory)) {
      throw new ValidationError(`Category must be one of: ${Object.values(ProductCategory).join(', ')}`);
    }
    updateData.category = category;
  }

  if (available !== undefined) {
    if (typeof available !== 'boolean') {
      throw new ValidationError('Available must be a boolean');
    }
    updateData.available = available;
  }

  return updateData;
};

export const validateProductId = (id: string): string => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new ValidationError('Product ID is required and must be a non-empty string');
  }
  return id.trim();
}; 