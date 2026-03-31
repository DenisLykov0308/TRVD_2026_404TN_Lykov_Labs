import type { Category, CategoryPayload } from '@/types/reference';
import apiClient from './client';

export const CategoriesService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async createCategory(payload: CategoryPayload): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', payload);
    return response.data;
  },

  async updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
    const response = await apiClient.patch<Category>(`/categories/${id}`, payload);
    return response.data;
  },

  async deleteCategory(id: number): Promise<Category> {
    const response = await apiClient.delete<Category>(`/categories/${id}`);
    return response.data;
  },
};
