import { apiClient } from "@/lib/api";

export const authService = {
  login: (email: string, password: string, role = "buyer") =>
    apiClient.post("/auth/login", { email, password, role }),
  register: (payload: Record<string, any>) => apiClient.post("/auth/register", payload),
  me: () => apiClient.get("/auth/me"),
};