import type { Supplier, SupplierPayload } from '@/types/reference';
import apiClient from './client';

export const SuppliersService = {
  async getSuppliers(): Promise<Supplier[]> {
    const response = await apiClient.get<Supplier[]>('/suppliers');
    return response.data;
  },

  async getSupplierById(id: number): Promise<Supplier> {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  async createSupplier(payload: SupplierPayload): Promise<Supplier> {
    const response = await apiClient.post<Supplier>('/suppliers', payload);
    return response.data;
  },

  async updateSupplier(id: number, payload: SupplierPayload): Promise<Supplier> {
    const response = await apiClient.patch<Supplier>(`/suppliers/${id}`, payload);
    return response.data;
  },

  async deleteSupplier(id: number): Promise<Supplier> {
    const response = await apiClient.delete<Supplier>(`/suppliers/${id}`);
    return response.data;
  },
};
