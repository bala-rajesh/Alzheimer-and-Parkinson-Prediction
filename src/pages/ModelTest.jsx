import React, { useState, useRef } from 'react';
import apiService from '../services/api';
import { usePredictions } from '../contexts/PredictionContext';
import ChatbotWidget from '../components/ChatbotWidget';

const ModelTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);
  const { addPrediction } = usePredictions();

  // Show notification function
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  // Disease specific information
  const diseaseInfo = {
    ALZHEIMER: {
      precautions: [
        "Protect your head from injury.",
        "Avoid smoking and limit alcohol.",
        "Go for regular health check-ups.",
        "Sleep 7–8 hours every night.",
        "Reduce and manage stress daily."
      ],
      recommendations: [
        "Exercise daily (walk, jog, stretch).",
        "Eat brain-friendly foods (greens, fish, nuts).",
        "Stay mentally active (read, play games).",
        "Keep social connections strong.",
        "Manage health (control BP, sugar, avoid smoking)."
      ]
    },
    PARKINSON: {
      precautions: [
        "Prevent falls with safe home setups.",
        "Avoid long periods of inactivity.",
        "Don't skip or adjust medication without advice.",
        "Watch for mood or sleep changes.",
        "Manage other health issues early."
      ],
      recommendations: [
        "Exercise regularly to stay mobile.",
        "Eat a balanced diet (fiber, fruits, vegetables).",
        "Practice activities that improve balance.",
        "Stay socially and mentally active.",
        "Take medications as prescribed."
      ]
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResults(null);
    } else {
      showNotification('Please select a valid image file (JPEG, PNG, etc.)', 'warning');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      console.log('Sending file for analysis:', selectedFile.name);
      const response = await apiService.predict(selectedFile);
      console.log('Analysis response:', response);
      
      if (response.success) {
        const prediction = response.prediction;
        
        // Map backend prediction codes to frontend codes
        const predictionMap = {
          'CONTROL': 'CONTROL',
          'AD': 'ALZHEIMER',
          'PD': 'PARKINSON'
        };
        
        // Use the backend response directly as it already matches the expected format
        const transformedResults = {
          prediction: predictionMap[prediction.name] || prediction.name,
          full_name: prediction.full_name,
          description: prediction.description,
          recommendation: prediction.recommendation,
          confidence: {
            control: prediction.confidence.control,
            alzheimer: prediction.confidence.alzheimer,
            parkinson: prediction.confidence.parkinson
          },
          primary_confidence: prediction.primary_confidence,
          metadata: response.metadata,
          disclaimer: response.disclaimer,
          image_url: response.image_url // Store Cloudinary URL
        };
        
        console.log('Transformed results:', transformedResults);
        setResults(transformedResults);
        
        // Save prediction to context for metrics
        addPrediction(transformedResults, selectedFile.name);
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error details:', error);
      
      // Handle different types of errors
      let errorMessage = 'Analysis failed. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        console.error('Server error response:', error.response);
        errorMessage = error.response.message || error.response.error || errorMessage;
      } else if (error.message) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'Authentication required. Please log in again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showNotification(`Analysis failed: ${errorMessage}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) {
      showNotification('No analysis results available to download.', 'warning');
      return;
    }

    try {
      setIsGeneratingReport(true);
      const filename = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') + '_report.pdf' : 'medical_report.pdf';
      
      console.log('Generating report...');
      const response = await apiService.generateReport(results, filename);
      
      if (response.success && response.blob) {
        try {
          console.log('Creating download link for PDF...');
          
          // Create blob URL for local download
          const blobUrl = window.URL.createObjectURL(
            new Blob([response.blob], { type: response.contentType || 'application/pdf' })
          );
          
          // Create download link
          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          downloadLink.href = blobUrl;
          downloadLink.download = response.filename;
          
          // Add to document and trigger download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          // Cleanup after a short delay
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(blobUrl);
          }, 200);
          
          console.log('Report download initiated successfully');
          
          // Show simple success message
          showNotification('Report downloaded successfully!', 'success');
        } catch (downloadError) {
          console.error('Download error:', downloadError);
          showNotification('Failed to download the report. Please try again.', 'error');
        }
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      showNotification(`Failed to download report: ${error.message || 'Unknown error occurred'}`, 'error');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setResults(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <ChatbotWidget />
      <div className="max-w-4xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          notification.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium whitespace-pre-line">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 ml-4 text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Model Testing</h1>
        <p className="text-lg text-gray-600">
          Upload MRI brain scans to test our AI models for Alzheimer's and Parkinson's disease detection.
        </p>
      </div>

      {/* Unified Analysis Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Neurological Analysis</h2>
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Dual Disease Detection</h3>
              <p className="text-gray-600 text-lg">Simultaneous analysis for both Alzheimer's and Parkinson's disease</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/70 rounded-lg p-4 border border-blue-200/50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Alzheimer's Detection</h4>
              </div>
              <p className="text-sm text-gray-600">Analyzes hippocampal atrophy, cortical thinning, and structural brain changes</p>
            </div>
            
            <div className="bg-white/70 rounded-lg p-4 border border-purple-200/50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Parkinson's Detection</h4>
              </div>
              <p className="text-sm text-gray-600">Examines substantia nigra changes, dopaminergic pathways, and motor cortex</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload MRI Scan</h2>
        
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop your MRI scan here
                </p>
                <p className="text-gray-600 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Choose File
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Supports: JPEG, PNG, DICOM files (Max 10MB)
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.dcm"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={resetAnalysis}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Image Preview */}
            <div className="mb-4">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="MRI Preview"
                className="w-full max-h-96 object-contain rounded-lg bg-gray-100 border border-gray-200"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Start Analysis'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI Analysis Results</h2>
          
          {/* Primary Result */}
          <div className={`rounded-xl p-6 mb-6 border-2 ${
            results.prediction === 'CONTROL' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{results.full_name}</h3>
                <p className="text-gray-600 text-lg">{results.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <p className="text-3xl font-bold text-gray-900">{results.primary_confidence.toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Recommendation */}
            <div className="bg-white/70 rounded-lg p-4 border border-gray-200/50">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recommendation
              </h4>
              <p className="text-gray-700">{results.recommendation}</p>
            </div>
          </div>

          {/* Disease Specific Information */}
          {results.prediction !== 'CONTROL' && diseaseInfo[results.prediction] && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Important Health Guidelines</h3>
              
              {/* Precautions */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Precautions
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {diseaseInfo[results.prediction].precautions.map((precaution, index) => (
                    <li key={index} className="ml-4">{precaution}</li>
                  ))}
                </ul>
              </div>
              
              {/* Additional Recommendations */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lifestyle Recommendations
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {diseaseInfo[results.prediction].recommendations.map((recommendation, index) => (
                    <li key={index} className="ml-4">{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Detailed Confidence Scores */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Confidence Scores</h4>
            <div className="space-y-4">
              {/* Control */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Normal/Control</span>
                  <span className="font-semibold text-green-600">{results.confidence.control.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 bg-green-500 rounded-full transition-all duration-500" 
                    style={{ width: `${results.confidence.control}%` }} 
                  />
                </div>
              </div>
              
              {/* Alzheimer's */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Alzheimer's Disease</span>
                  <span className="font-semibold text-red-600">{results.confidence.alzheimer.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 bg-red-500 rounded-full transition-all duration-500" 
                    style={{ width: `${results.confidence.alzheimer}%` }} 
                  />
                </div>
              </div>
              
              {/* Parkinson's */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Parkinson's Disease</span>
                  <span className="font-semibold text-orange-600">{results.confidence.parkinson.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${results.confidence.parkinson}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Metadata */}
          {results.metadata && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Analysis Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Analyzed:</span>
                  <span className="ml-2 font-medium">{new Date(results.metadata.timestamp).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">File:</span>
                  <span className="ml-2 font-medium">{results.metadata.filename}</span>
                </div>
                <div>
                  <span className="text-gray-600">Model Version:</span>
                  <span className="ml-2 font-medium">{results.metadata.model_version}</span>
                </div>
                <div>
                  <span className="text-gray-600">User ID:</span>
                  <span className="ml-2 font-medium">{results.metadata.user_id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {results.disclaimer && (
            <div className="bg-yellow-50 rounded-xl p-6 mb-6 border border-yellow-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Important Disclaimer
              </h4>
              <p className="text-sm text-gray-700">{results.disclaimer}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetAnalysis}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Analyze Another Scan
            </button>
            <button 
              onClick={handleDownloadReport}
              disabled={isGeneratingReport}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGeneratingReport ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Report...</span>
                </div>
              ) : (
                'Download Report'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ModelTest;