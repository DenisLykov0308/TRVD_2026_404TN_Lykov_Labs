import type {
  InventoryTransaction,
  InventoryTransactionsQuery,
} from '@/types/inventory';
import apiClient from './client';

export const InventoryTransactionsService = {
  async getInventoryTransactions(
    params?: InventoryTransactionsQuery,
  ): Promise<InventoryTransaction[]> {
    const response = await apiClient.get<InventoryTransaction[]>(
      '/inventory-transactions',
      { params },
    );
    return response.data;
  },
};
