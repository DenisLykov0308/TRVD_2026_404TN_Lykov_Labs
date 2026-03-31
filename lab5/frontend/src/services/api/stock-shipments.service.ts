import type { StockShipment, StockShipmentPayload } from '@/types/inventory';
import apiClient from './client';

export const StockShipmentsService = {
  async getStockShipments(): Promise<StockShipment[]> {
    const response = await apiClient.get<StockShipment[]>('/stock-shipments');
    return response.data;
  },

  async getStockShipmentById(id: number): Promise<StockShipment> {
    const response = await apiClient.get<StockShipment>(`/stock-shipments/${id}`);
    return response.data;
  },

  async createStockShipment(payload: StockShipmentPayload): Promise<StockShipment> {
    const response = await apiClient.post<StockShipment>('/stock-shipments', payload);
    return response.data;
  },
};
