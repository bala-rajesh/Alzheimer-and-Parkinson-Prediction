import jsPDF from 'jspdf';

// API Service for Medical AI Application
class ApiService {
  constructor() {
    this.baseURL = `${import.meta.env.VITE_API_URL}/api`;
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
      console.log('Creating form data for prediction');
      const formData = new FormData();
      formData.append('image', imageFile);

      console.log('Sending prediction request');
      const response = await this.request('/predictions/predict', {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });

      console.log('Prediction response received:', response);
      return response;
    } catch (error) {
      console.error('Prediction request failed:', error);
      if (error.response) {
        throw error.response;
      }
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

  // Report generation - Generate PDF locally and upload to Cloudinary
  async generateReport(reportData, filename) {
    try {
      console.log('Generating PDF report locally using jsPDF');
      
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      // Helper function to add text with word wrapping
      const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        if (isBold) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }
        
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach(line => {
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(line, margin, yPosition);
          yPosition += fontSize * 0.6;
        });
        yPosition += 5; // Add some spacing after text
      };
      
      // Helper function to add a line
      const addLine = () => {
        yPosition += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      };
      
      // Helper function to add confidence bar
      const addConfidenceBar = (label, percentage, color) => {
        const barWidth = maxWidth * 0.6;
        const barHeight = 8;
        const fillWidth = (barWidth * percentage) / 100;
        
        // Label
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${label}: ${percentage.toFixed(1)}%`, margin, yPosition);
        yPosition += 12;
        
        // Background bar
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition, barWidth, barHeight, 'F');
        
        // Fill bar
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(margin, yPosition, fillWidth, barHeight, 'F');
        
        yPosition += barHeight + 10;
      };
      
      const timestamp = new Date().toLocaleString();
      
      // Header
      addText('MEDICAL AI ANALYSIS REPORT', 20, true, [0, 100, 200]);
      addText(`Generated: ${timestamp}`, 10, false, [100, 100, 100]);
      addText(`File: ${reportData.metadata?.filename || 'Unknown'}`, 10, false, [100, 100, 100]);
      addLine();
      
      // Analysis Results Section
      addText('ANALYSIS RESULTS', 16, true, [0, 0, 0]);
      addText(`Primary Diagnosis: ${reportData.full_name}`, 12, true);
      addText(`Confidence: ${reportData.primary_confidence?.toFixed(1)}%`, 12, true, [0, 150, 0]);
      addText(`Description: ${reportData.description}`, 11);
      yPosition += 10;
      
      // Recommendation Section
      addText('RECOMMENDATION', 14, true, [0, 100, 200]);
      addText(reportData.recommendation, 11);
      yPosition += 10;
      
      // Detailed Confidence Scores Section
      addText('DETAILED CONFIDENCE SCORES', 14, true, [0, 100, 200]);
      yPosition += 5;
      
      // Confidence bars
      addConfidenceBar('Normal/Control', reportData.confidence?.control || 0, [76, 175, 80]);
      addConfidenceBar('Alzheimer\'s Disease', reportData.confidence?.alzheimer || 0, [244, 67, 54]);
      addConfidenceBar('Parkinson\'s Disease', reportData.confidence?.parkinson || 0, [255, 152, 0]);
      
      yPosition += 10;
      
      // Analysis Metadata Section
      addText('ANALYSIS METADATA', 14, true, [0, 100, 200]);
      addText(`Model Version: ${reportData.metadata?.model_version || 'Unknown'}`, 10);
      addText(`User ID: ${reportData.metadata?.user_id || 'Unknown'}`, 10);
      addText(`Analysis Timestamp: ${reportData.metadata?.timestamp || timestamp}`, 10);
      yPosition += 15;
      
      // Disclaimer Section
      addText('IMPORTANT DISCLAIMER', 14, true, [200, 100, 0]);
      const disclaimer = reportData.disclaimer || 'This analysis is for research purposes only and should not be used for medical diagnosis. Please consult with a qualified healthcare professional for proper medical evaluation.';
      
      // Add disclaimer in a box
      const disclaimerLines = doc.splitTextToSize(disclaimer, maxWidth - 20);
      const disclaimerHeight = disclaimerLines.length * 6 + 20;
      
      // Check if we need a new page for disclaimer
      if (yPosition + disclaimerHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Draw disclaimer box
      doc.setFillColor(255, 243, 205);
      doc.setDrawColor(255, 234, 167);
      doc.rect(margin, yPosition, maxWidth, disclaimerHeight, 'FD');
      
      yPosition += 15;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      disclaimerLines.forEach(line => {
        doc.text(line, margin + 10, yPosition);
        yPosition += 6;
      });
      
      // Footer
      yPosition = pageHeight - 30;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Report generated by Medical AI Analysis System', margin, yPosition);
      
      // Generate PDF blob
      const pdfBlob = doc.output('blob');
      
      console.log('PDF report generated successfully, size:', pdfBlob.size);
      
      // Now upload the PDF to Cloudinary via backend
      console.log('Uploading PDF to Cloudinary...');
      const cloudinaryResponse = await this.uploadPDFToCloudinary(pdfBlob, filename);
      
      return {
        success: true,
        blob: pdfBlob, // Still provide blob for local download
        filename: filename.endsWith('.pdf') ? filename : filename + '.pdf',
        contentType: 'application/pdf',
        cloudinaryUrl: cloudinaryResponse.cloudinaryUrl, // Cloudinary URL
        cloudinaryPublicId: cloudinaryResponse.publicId
      };
    } catch (error) {
      console.error('Local PDF generation failed:', error);
      
      // Fallback: Try backend generation
      try {
        console.log('Trying backend report generation as fallback');
        return await this.generateReportFromBackend(reportData, filename);
      } catch (backendError) {
        console.error('Backend report generation also failed:', backendError);
        throw new Error('Both local and backend report generation failed');
      }
    }
  }

  // Upload PDF to Cloudinary via backend
  async uploadPDFToCloudinary(pdfBlob, filename) {
    try {
      console.log('Uploading PDF to Cloudinary via backend...');
      
      const formData = new FormData();
      formData.append('pdf', pdfBlob, filename);
      
      const response = await fetch(`${this.baseURL}/predictions/upload-pdf-report`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('PDF uploaded to Cloudinary successfully:', result.cloudinary_url);
        return {
          cloudinaryUrl: result.cloudinary_url,
          publicId: result.public_id
        };
      } else {
        throw new Error(result.message || 'Failed to upload PDF to Cloudinary');
      }
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      // Don't throw error here, just log it - local download should still work
      return {
        cloudinaryUrl: null,
        publicId: null
      };
    }
  }

  // Generate text-based report
  generateTextReport(reportData) {
    const timestamp = new Date().toLocaleString();
    
    return `
MEDICAL AI ANALYSIS REPORT
==========================

Generated: ${timestamp}
Filename: ${reportData.metadata?.filename || 'Unknown'}

ANALYSIS RESULTS
================
Primary Diagnosis: ${reportData.full_name}
Confidence: ${reportData.primary_confidence?.toFixed(1)}%
Description: ${reportData.description}

DETAILED CONFIDENCE SCORES
===========================
Normal/Control: ${reportData.confidence?.control?.toFixed(1)}%
Alzheimer's Disease: ${reportData.confidence?.alzheimer?.toFixed(1)}%
Parkinson's Disease: ${reportData.confidence?.parkinson?.toFixed(1)}%

RECOMMENDATION
==============
${reportData.recommendation}

ANALYSIS METADATA
=================
Model Version: ${reportData.metadata?.model_version || 'Unknown'}
User ID: ${reportData.metadata?.user_id || 'Unknown'}
Timestamp: ${reportData.metadata?.timestamp || timestamp}

IMPORTANT DISCLAIMER
====================
${reportData.disclaimer || 'This analysis is for research purposes only and should not be used for medical diagnosis. Please consult with a qualified healthcare professional for proper medical evaluation.'}

---
Report generated by Medical AI Analysis System
    `.trim();
  }

  // Generate HTML content for PDF
  generatePDFContent(reportData) {
    const timestamp = new Date().toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Medical AI Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .confidence-bar { background: #f0f0f0; height: 20px; border-radius: 10px; margin: 5px 0; }
        .confidence-fill { height: 100%; border-radius: 10px; }
        .normal { background: #4CAF50; }
        .alzheimer { background: #f44336; }
        .parkinson { background: #ff9800; }
        .disclaimer { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Medical AI Analysis Report</h1>
        <p>Generated: ${timestamp}</p>
    </div>
    
    <div class="section">
        <h2>Analysis Results</h2>
        <p><strong>Primary Diagnosis:</strong> ${reportData.full_name}</p>
        <p><strong>Confidence:</strong> ${reportData.primary_confidence?.toFixed(1)}%</p>
        <p><strong>Description:</strong> ${reportData.description}</p>
    </div>
    
    <div class="section">
        <h2>Detailed Confidence Scores</h2>
        <div>
            <p>Normal/Control: ${reportData.confidence?.control?.toFixed(1)}%</p>
            <div class="confidence-bar">
                <div class="confidence-fill normal" style="width: ${reportData.confidence?.control}%"></div>
            </div>
        </div>
        <div>
            <p>Alzheimer's Disease: ${reportData.confidence?.alzheimer?.toFixed(1)}%</p>
            <div class="confidence-bar">
                <div class="confidence-fill alzheimer" style="width: ${reportData.confidence?.alzheimer}%"></div>
            </div>
        </div>
        <div>
            <p>Parkinson's Disease: ${reportData.confidence?.parkinson?.toFixed(1)}%</p>
            <div class="confidence-bar">
                <div class="confidence-fill parkinson" style="width: ${reportData.confidence?.parkinson}%"></div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>Recommendation</h2>
        <p>${reportData.recommendation}</p>
    </div>
    
    <div class="section disclaimer">
        <h2>Important Disclaimer</h2>
        <p>${reportData.disclaimer || 'This analysis is for research purposes only and should not be used for medical diagnosis. Please consult with a qualified healthcare professional for proper medical evaluation.'}</p>
    </div>
</body>
</html>
    `.trim();
  }

  // Fallback: Try backend generation
  async generateReportFromBackend(reportData, filename) {
    const url = `${this.baseURL}/predictions/generate-report`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        results: reportData,
        filename: filename,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Check if the response is a PDF (binary data)
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      // Direct PDF response
      console.log('Received direct PDF response from backend');
      const pdfBlob = await response.blob();
      
      if (pdfBlob.size === 0) {
        throw new Error('Downloaded PDF is empty');
      }
      
      console.log('PDF downloaded successfully from backend, size:', pdfBlob.size);
      
      return {
        success: true,
        blob: pdfBlob,
        filename: filename,
        contentType: 'application/pdf'
      };
    } else {
      // JSON response - backend doesn't support direct PDF
      const jsonResponse = await response.json();
      throw new Error(jsonResponse.message || 'Backend PDF generation not supported');
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