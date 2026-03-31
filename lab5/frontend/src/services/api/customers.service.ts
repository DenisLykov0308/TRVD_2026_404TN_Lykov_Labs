import type { Customer, CustomerPayload } from '@/types/reference';
import apiClient from './client';

export const CustomersService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers');
    return response.data;
  },

  async getCustomerById(id: number): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(payload: CustomerPayload): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', payload);
    return response.data;
  },

  async updateCustomer(id: number, payload: CustomerPayload): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`/customers/${id}`, payload);
    return response.data;
  },

  async deleteCustomer(id: number): Promise<Customer> {
    const response = await apiClient.delete<Customer>(`/customers/${id}`);
    return response.data;
  },
};
