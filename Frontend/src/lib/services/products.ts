import { apiClient } from "@/lib/api";

export const productsService = {
  list: (params?: Record<string, any>) => apiClient.get("/products", { params }),
  get: (id: string) => apiClient.get(`/products/${id}`),
};