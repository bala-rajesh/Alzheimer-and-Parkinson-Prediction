import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PredictionContext = createContext();

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
};

export const PredictionProvider = ({ children }) => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalScans: 0,
    accuracy: 95.8,
    processingTime: 2.3,
    detectionRate: 0
  });
  const [diseaseMetrics, setDiseaseMetrics] = useState([]);

  // Get user-specific localStorage key
  const getUserStorageKey = () => {
    return user ? `predictionHistory_${user.id}` : 'predictionHistory_guest';
  };

  // One-time data reset for proper user isolation
  useEffect(() => {
    // Check if reset has already been done
    const resetDone = localStorage.getItem('userIsolationReset_v3');
    
    if (!resetDone) {
      // Clear ALL prediction-related data to ensure proper user isolation
      const allKeys = Object.keys(localStorage);
      const predictionKeys = allKeys.filter(key => 
        key.includes('predictionHistory') || 
        key.includes('legacyDataMigrated') ||
        key.includes('predictionDataReset')
      );
      
      // Clear all prediction-related keys
      predictionKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Mark reset as done
      localStorage.setItem('userIsolationReset_v3', 'true');
      
      console.log('One-time prediction data reset completed for proper user isolation');
    }
  }, []);

  // Load predictions from localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      const storageKey = getUserStorageKey();
      const savedPredictions = localStorage.getItem(storageKey);
      
      if (savedPredictions) {
        try {
          const parsedPredictions = JSON.parse(savedPredictions);
          setPredictions(parsedPredictions);
          updateMetrics(parsedPredictions);
        } catch (error) {
          console.error('Error loading prediction history:', error);
          // If there's an error, start fresh
          setPredictions([]);
          updateMetrics([]);
        }
      } else {
        // No data for this user - start fresh
        setPredictions([]);
        updateMetrics([]);
      }
    } else {
      // No user logged in - clear data
      setPredictions([]);
      updateMetrics([]);
    }
  }, [user]);

  // Save predictions to localStorage whenever predictions change
  useEffect(() => {
    if (user && predictions.length >= 0) {
      const storageKey = getUserStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(predictions));
      updateMetrics(predictions);
    }
  }, [predictions, user]);

  const updateMetrics = (predictionList) => {
    const totalScans = predictionList.length;
    
    // Calculate disease-specific metrics
    const controlCount = predictionList.filter(p => p.prediction === 'CONTROL').length;
    const adCount = predictionList.filter(p => p.prediction === 'ALZHEIMER').length;
    const pdCount = predictionList.filter(p => p.prediction === 'PARKINSON').length;
    
    // Calculate detection rate (non-control cases)
    const detectionRate = totalScans > 0 ? ((adCount + pdCount) / totalScans) * 100 : 0;

    setMetrics({
      totalScans,
      accuracy: 95.8, // This would be calculated based on actual accuracy metrics
      processingTime: 2.3,
      detectionRate
    });

    // Update disease metrics state
    updateDiseaseMetrics(predictionList);
  };

  const updateDiseaseMetrics = (predictionList) => {
    console.log('updateDiseaseMetrics called with predictions:', predictionList.length);
    
    if (predictionList.length === 0) {
      console.log('No predictions found, setting empty disease metrics');
      setDiseaseMetrics([
        {
          disease: "Normal/Control Cases",
          code: "CONTROL",
          totalCases: 0,
          accuracy: 97.1,
          avgConfidence: 0,
          color: 'green'
        },
        {
          disease: "Alzheimer's Disease",
          code: "ALZHEIMER",
          totalCases: 0,
          accuracy: 96.2,
          avgConfidence: 0,
          color: 'blue'
        },
        {
          disease: "Parkinson's Disease",
          code: "PARKINSON",
          totalCases: 0,
          accuracy: 95.4,
          avgConfidence: 0,
          color: 'purple'
        }
      ]);
      return;
    }

    const controlPredictions = predictionList.filter(p => p.prediction === 'CONTROL');
    const adPredictions = predictionList.filter(p => p.prediction === 'ALZHEIMER');
    const pdPredictions = predictionList.filter(p => p.prediction === 'PARKINSON');

    console.log('Disease counts:', {
      control: controlPredictions.length,
      alzheimer: adPredictions.length,
      parkinson: pdPredictions.length
    });

    const calculateAvgConfidence = (predList) => {
      if (predList.length === 0) return 0;
      const sum = predList.reduce((acc, pred) => acc + pred.confidence, 0);
      return sum / predList.length;
    };

    setDiseaseMetrics([
      {
        disease: "Normal/Control Cases",
        code: "CONTROL",
        totalCases: controlPredictions.length,
        accuracy: 97.1,
        avgConfidence: calculateAvgConfidence(controlPredictions),
        color: 'green'
      },
      {
        disease: "Alzheimer's Disease",
        code: "ALZHEIMER",
        totalCases: adPredictions.length,
        accuracy: 96.2,
        avgConfidence: calculateAvgConfidence(adPredictions),
        color: 'blue'
      },
      {
        disease: "Parkinson's Disease",
        code: "PARKINSON",
        totalCases: pdPredictions.length,
        accuracy: 95.4,
        avgConfidence: calculateAvgConfidence(pdPredictions),
        color: 'purple'
      }
    ]);
  };

  const addPrediction = (predictionResult, filename) => {
    const newPrediction = {
      id: Date.now(),
      patientId: `P-${new Date().getFullYear()}-${String(predictions.length + 1).padStart(3, '0')}`,
      prediction: predictionResult.prediction,
      result: predictionResult.full_name,
      confidence: predictionResult.primary_confidence,
      timestamp: new Date().toISOString(),
      filename: filename,
      status: 'completed',
      type: predictionResult.prediction === 'CONTROL' ? 'normal' : 'disease',
      detailedConfidence: predictionResult.confidence,
      recommendation: predictionResult.recommendation,
      description: predictionResult.description
    };

    setPredictions(prev => [newPrediction, ...prev].slice(0, 50)); // Keep only last 50 predictions
  };

  const getRecentPredictions = (limit = 5) => {
    return predictions.slice(0, limit);
  };

  const getDiseaseMetrics = () => {
    console.log('getDiseaseMetrics called with predictions:', predictions.length);
    
    if (predictions.length === 0) {
      console.log('No predictions found, returning empty metrics');
      return [
        {
          disease: "Normal/Control Cases",
          code: "CONTROL",
          totalCases: 0,
          accuracy: 97.1,
          avgConfidence: 0,
          color: 'green'
        },
        {
          disease: "Alzheimer's Disease",
          code: "ALZHEIMER",
          totalCases: 0,
          accuracy: 96.2,
          avgConfidence: 0,
          color: 'blue'
        },
        {
          disease: "Parkinson's Disease",
          code: "PARKINSON",
          totalCases: 0,
          accuracy: 95.4,
          avgConfidence: 0,
          color: 'purple'
        }
      ];
    }

    const controlPredictions = predictions.filter(p => p.prediction === 'CONTROL');
    const adPredictions = predictions.filter(p => p.prediction === 'ALZHEIMER');
    const pdPredictions = predictions.filter(p => p.prediction === 'PARKINSON');

    console.log('Disease counts:', {
      control: controlPredictions.length,
      alzheimer: adPredictions.length,
      parkinson: pdPredictions.length
    });

    const calculateAvgConfidence = (predList) => {
      if (predList.length === 0) return 0;
      const sum = predList.reduce((acc, pred) => acc + pred.confidence, 0);
      return sum / predList.length;
    };

    return [
      {
        disease: "Normal/Control Cases",
        code: "CONTROL",
        totalCases: controlPredictions.length,
        accuracy: 97.1,
        avgConfidence: calculateAvgConfidence(controlPredictions),
        color: 'green'
      },
      {
        disease: "Alzheimer's Disease",
        code: "ALZHEIMER",
        totalCases: adPredictions.length,
        accuracy: 96.2,
        avgConfidence: calculateAvgConfidence(adPredictions),
        color: 'blue'
      },
      {
        disease: "Parkinson's Disease",
        code: "PARKINSON",
        totalCases: pdPredictions.length,
        accuracy: 95.4,
        avgConfidence: calculateAvgConfidence(pdPredictions),
        color: 'purple'
      }
    ];
  };

  const getFormattedTimestamp = (timestamp) => {
    const now = new Date();
    const predTime = new Date(timestamp);
    const diffMs = now - predTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return predTime.toLocaleDateString();
  };

  const value = {
    predictions,
    metrics,
    diseaseMetrics,
    addPrediction,
    getRecentPredictions,
    getDiseaseMetrics,
    getFormattedTimestamp
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};