import api from './api';
import { Analytics, UserOverview } from '../types';

export const analyticsService = {
  async getLinkAnalytics(linkId: string): Promise<Analytics> {
    const response = await api.get(`/analytics/link/${linkId}`);
    return response.data;
  },

  async getUserOverview(): Promise<UserOverview> {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
};
