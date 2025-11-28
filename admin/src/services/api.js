import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:4000/api');

class AuthAPI {
  constructor() {
    this.token = null;
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setToken(token) {
    this.token = token;
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  setupInterceptors() {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(adminData) {
    return this.api.post('/admin/auth/register', adminData);
  }

  async login(email, password) {
    return this.api.post('/admin/auth/login', { email, password });
  }

  async getProfile() {
    return this.api.get('/admin/auth/profile');
  }

  async updateProfile(updateData) {
    return this.api.put('/admin/auth/profile', updateData);
  }

  async changePassword(currentPassword, newPassword) {
    return this.api.post('/admin/auth/change-password', { currentPassword, newPassword });
  }

  async forgotPassword(email) {
    return this.api.post('/admin/auth/forgot-password', { email });
  }

  async resetPassword(token, newPassword) {
    return this.api.post('/admin/auth/reset-password', { token, newPassword });
  }

  async logout() {
    return this.api.post('/admin/auth/logout');
  }
}

class CategoriesAPI {
  constructor(apiInstance) {
    this.api = apiInstance;
  }

  async getAll(params) {
    return this.api.get('/categories', { params });
  }

  async getOne(id) {
    return this.api.get(`/categories/${id}`);
  }

  async create(data) {
    return this.api.post('/categories', data);
  }

  async update(id, data) {
    return this.api.put(`/categories/${id}`, data);
  }

  async delete(id) {
    return this.api.delete(`/categories/${id}`);
  }

  async getStats() {
    return this.api.get('/categories/stats/summary');
  }
}

class ProductsAPI {
  constructor(apiInstance) {
    this.api = apiInstance;
  }

  async getAll(params) {
    return this.api.get('/products', { params });
  }

  async getOne(id) {
    return this.api.get(`/products/${id}`);
  }

  async create(productData) {
    // Check if productData is FormData (file upload)
    if (productData instanceof FormData) {
      return this.api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return this.api.post('/products', productData);
  }

  async update(id, productData) {
    // Check if productData is FormData (file upload)
    if (productData instanceof FormData) {
      return this.api.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return this.api.put(`/products/${id}`, productData);
  }

  async delete(id) {
    return this.api.delete(`/products/${id}`);
  }

  async getStats() {
    return this.api.get('/products/stats/summary');
  }
}

class OrdersAPI {
  constructor(apiInstance) {
    this.api = apiInstance;
  }

  async getAll(params) {
    return this.api.get('/orders', { params });
  }

  async getOne(id) {
    return this.api.get(`/orders/${id}`);
  }

  async updateStatus(id, status) {
    return this.api.put(`/orders/${id}`, { status });
  }

  async updatePaymentStatus(id, status, transactionId) {
    return this.api.put(`/orders/${id}/payment-status`, { paymentStatus: status, transactionId });
  }

  async getStats() {
    return this.api.get('/orders/stats/summary');
  }

  async getRecent(limit = 5) {
    return this.api.get(`/orders/recent/${limit}`);
  }
}

// Create main API instance
const authAPI = new AuthAPI();

export {
  authAPI,
  CategoriesAPI,
  ProductsAPI,
  OrdersAPI
};
