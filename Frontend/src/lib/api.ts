const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller';
    businessName?: string;
    businessAddress?: string;
  }) => {
    return apiClient.post<{ token: string; user: any }>('/auth/register', data);
  },

  login: async (data: { email: string; password: string; role?: 'buyer' | 'seller' }) => {
    return apiClient.post<{ token: string; user: any }>('/auth/login', data);
  },

  getMe: async () => {
    return apiClient.get<{ user: any }>('/auth/me');
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    sortBy?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<{ products: any[]; pagination: any }>(
      `/products${query ? `?${query}` : ''}`
    );
  },

  getById: async (id: string) => {
    return apiClient.get<any>(`/products/${id}`);
  },

  create: async (data: FormData) => {
    return apiClient.postFormData<any>('/products', data);
  },

  update: async (id: string, data: FormData) => {
    return apiClient.putFormData<any>(`/products/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/products/${id}`);
  },
};

// Businesses API
export const businessesAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<{ businesses: any[]; pagination: any }>(
      `/businesses${query ? `?${query}` : ''}`
    );
  },

  getById: async (id: string) => {
    return apiClient.get<any>(`/businesses/${id}`);
  },

  create: async (data: FormData) => {
    return apiClient.postFormData<any>('/businesses', data);
  },

  update: async (id: string, data: FormData) => {
    return apiClient.putFormData<any>(`/businesses/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/businesses/${id}`);
  },
};

// Ratings API
export const ratingsAPI = {
  create: async (data: {
    productId?: string;
    businessId?: string;
    rating: number;
    comment?: string;
    aspects?: {
      materials: number;
      packaging: number;
      carbonFootprint: number;
      laborPractices: number;
    };
  }) => {
    return apiClient.post<any>('/ratings', data);
  },

  getByProduct: async (productId: string) => {
    return apiClient.get<any[]>(`/ratings/product/${productId}`);
  },

  getByBusiness: async (businessId: string) => {
    return apiClient.get<any[]>(`/ratings/business/${businessId}`);
  },

  update: async (id: string, data: {
    rating?: number;
    comment?: string;
    aspects?: {
      materials: number;
      packaging: number;
      carbonFootprint: number;
      laborPractices: number;
    };
  }) => {
    return apiClient.put<any>(`/ratings/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/ratings/${id}`);
  },
};

