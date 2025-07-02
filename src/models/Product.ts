export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  available?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  available?: boolean;
}

export enum ProductCategory {
  ESPRESSO = 'espresso',
  COFFEE = 'coffee',
  LATTE = 'latte',
  CAPPUCCINO = 'cappuccino',
  FRAPPUCCINO = 'frappuccino',
  TEA = 'tea',
  PASTRY = 'pastry',
  SANDWICH = 'sandwich'
} 