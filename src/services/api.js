// API Service for Medical AI Application
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = localStorage.getItem('authToken');
    this.mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    this.mockPredictions = JSON.parse(localStorage.getItem('mockPredictions') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      this.currentUser = null;
    }
  }

  // Remove authentication token (alias for setToken(null))
  removeAuthToken() {
    this.setToken(null);
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Get multipart headers for file uploads
  getMultipartHeaders() {
    const headers = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Generate mock delay to simulate network requests
  async mockDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate mock user ID
  generateUserId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Generate mock prediction ID
  generatePredictionId() {
    return 'pred_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Authentication methods
  async register(userData) {
    try {
      const response = await this.request('/users/register', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (response.access_token) {
        this.setToken(response.access_token);
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/users/login', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      if (response.access_token) {
        this.setToken(response.access_token);
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.request('/users/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local logout even if server request fails
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    try {
      const response = await this.request('/users/profile', {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.request('/users/profile', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      return response;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await this.request('/users/change-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      return response;
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  }

  // AI Prediction methods
  async predict(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await this.request('/predictions/predict', {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });

      return response;
    } catch (error) {
      console.error('Prediction failed:', error);
      throw error;
    }
  }

  // Test predictions endpoint
  async testPredictionsEndpoint() {
    try {
      const response = await this.request('/predictions/test', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Test endpoint failed:', error);
      throw error;
    }
  }

  // Report generation
  async generateReport(reportData, filename) {
    try {
      console.log('Generating report with endpoint: /predictions/generate-report');
      console.log('Base URL:', this.baseURL);
      
      // Test the endpoint first
      try {
        await this.testPredictionsEndpoint();
        console.log('Predictions endpoint is accessible');
      } catch (testError) {
        console.error('Predictions endpoint test failed:', testError);
      }
      
      const response = await this.request('/predictions/generate-report', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          results: reportData,
          filename: filename,
        }),
      });

      if (response.success && response.download_url) {
        // Trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = `${this.baseURL.replace('/api', '')}${response.download_url}`;
        downloadLink.download = response.filename || `medical_report_${new Date().toISOString().split('T')[0]}.pdf`;
        downloadLink.click();
      }

      return response;
    } catch (error) {
      console.error('Report generation failed:', error);
      console.error('Full error details:', error);
      throw error;
    }
  }

  // Prediction history
  async getPredictionHistory(limit = 10, offset = 0) {
    try {
      const response = await this.request(`/predictions/history?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Get prediction history failed:', error);
      throw error;
    }
  }

  // Metrics
  async getMetrics() {
    try {
      const response = await this.request('/metrics', {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Get metrics failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/health', {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // System status
  async getSystemStatus() {
    try {
      const response = await this.healthCheck();
      
      return {
        database: response.database === 'connected',
        aiModel: response.ai_model === 'loaded',
        overall: response.status === 'healthy',
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error('Get system status failed:', error);
      return {
        database: false,
        aiModel: false,
        overall: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  clearAuth() {
    this.setToken(null);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;