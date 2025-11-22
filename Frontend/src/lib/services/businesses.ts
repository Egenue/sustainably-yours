import { apiClient } from "@/lib/api";

export const businessesService = {
  list: (params?: Record<string, any>) => apiClient.get("/businesses", { params }),
  get: (id: string) => apiClient.get(`/businesses/${id}`),
};