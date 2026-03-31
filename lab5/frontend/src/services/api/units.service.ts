import type { Unit, UnitPayload } from '@/types/reference';
import apiClient from './client';

export const UnitsService = {
  async getUnits(): Promise<Unit[]> {
    const response = await apiClient.get<Unit[]>('/units');
    return response.data;
  },

  async getUnitById(id: number): Promise<Unit> {
    const response = await apiClient.get<Unit>(`/units/${id}`);
    return response.data;
  },

  async createUnit(payload: UnitPayload): Promise<Unit> {
    const response = await apiClient.post<Unit>('/units', payload);
    return response.data;
  },

  async updateUnit(id: number, payload: UnitPayload): Promise<Unit> {
    const response = await apiClient.patch<Unit>(`/units/${id}`, payload);
    return response.data;
  },

  async deleteUnit(id: number): Promise<Unit> {
    const response = await apiClient.delete<Unit>(`/units/${id}`);
    return response.data;
  },
};
