// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateStock(id, stockData) {
    return this.request(`/products/${id}/stock`, {
      method: 'POST',
      body: JSON.stringify(stockData),
    });
  }

  async getProductTransactions(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/${id}/transactions${queryString ? `?${queryString}` : ''}`);
  }

  async getLowStockProducts() {
    return this.request('/products/alerts/low-stock');
  }

  async getReorderProducts() {
    return this.request('/products/alerts/reorder');
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id) {
    return this.request(`/categories/${id}`);
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategoryStats(id) {
    return this.request(`/categories/${id}/stats`);
  }

  // Analytics endpoints
  async getDashboardStats() {
    return this.request('/analytics/dashboard');
  }

  async getInventoryMovement(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/inventory-movement${queryString ? `?${queryString}` : ''}`);
  }

  async getDemandPrediction(productId, months = 12) {
    return this.request(`/analytics/demand-prediction/${productId}?months=${months}`);
  }

  async getIMOAnalysis() {
    return this.request('/analytics/imo-analysis');
  }

  async getRecentTransactions(limit = 10) {
    return this.request(`/analytics/recent-transactions?limit=${limit}`);
  }
}

export default new ApiService();