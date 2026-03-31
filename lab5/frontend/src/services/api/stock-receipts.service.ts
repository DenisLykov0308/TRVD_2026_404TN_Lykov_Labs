import type { StockReceipt, StockReceiptPayload } from '@/types/inventory';
import apiClient from './client';

export const StockReceiptsService = {
  async getStockReceipts(): Promise<StockReceipt[]> {
    const response = await apiClient.get<StockReceipt[]>('/stock-receipts');
    return response.data;
  },

  async getStockReceiptById(id: number): Promise<StockReceipt> {
    const response = await apiClient.get<StockReceipt>(`/stock-receipts/${id}`);
    return response.data;
  },

  async createStockReceipt(payload: StockReceiptPayload): Promise<StockReceipt> {
    const response = await apiClient.post<StockReceipt>('/stock-receipts', payload);
    return response.data;
  },
};
