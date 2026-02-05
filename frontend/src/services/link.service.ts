import api from './api';
import { Link, CreateLinkRequest, UpdateLinkRequest } from '../types';

export const linkService = {
  async createLink(data: CreateLinkRequest): Promise<Link> {
    const response = await api.post('/links', data);
    return response.data;
  },

  async createPublicLink(originalUrl: string) {
    const response = await api.post('/links/public', { originalUrl });
    return response.data;
  },

  async getLinks(page = 1, limit = 20) {
    const response = await api.get(`/links?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getLink(id: string): Promise<Link> {
    const response = await api.get(`/links/${id}`);
    return response.data;
  },

  async updateLink(id: string, data: UpdateLinkRequest): Promise<Link> {
    const response = await api.put(`/links/${id}`, data);
    return response.data;
  },

  async deleteLink(id: string) {
    const response = await api.delete(`/links/${id}`);
    return response.data;
  },
};
