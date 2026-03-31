import type { Product, ProductListParams, ProductPayload } from '@/types/product';
import apiClient from './client';

export const ProductService = {
  async getProducts(params?: ProductListParams): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(payload: ProductPayload): Promise<Product> {
    const response = await apiClient.post<Product>('/products', payload);
    return response.data;
  },

  async updateProduct(id: number, payload: ProductPayload): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload);
    return response.data;
  },

  async deleteProduct(id: number): Promise<Product> {
    const response = await apiClient.delete<Product>(`/products/${id}`);
    return response.data;
  },
};
