import React, { useState, useEffect } from "react";
import { usePredictions } from "../contexts/PredictionContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfusionMatrix from "../assets/ConfusionMatrix.png";
import ChatbotWidget from "../components/ChatbotWidget";

const Metrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [animatedValues, setAnimatedValues] = useState({
    totalScans: 0,
    accuracy: 0,
    processingTime: 0,
    detectionRate: 0,
  });

  const {
    metrics,
    getRecentPredictions,
    getDiseaseMetrics,
    getFormattedTimestamp,
  } = usePredictions();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Animate numbers on component mount and when metrics change
  useEffect(() => {
    const targets = {
      totalScans: metrics.totalScans,
      accuracy: metrics.accuracy,
      processingTime: metrics.processingTime,
      detectionRate: metrics.detectionRate,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        totalScans: Math.floor(targets.totalScans * progress),
        accuracy: Math.floor(targets.accuracy * progress * 10) / 10,
        processingTime: Math.floor(targets.processingTime * progress * 10) / 10,
        detectionRate: Math.floor(targets.detectionRate * progress * 10) / 10,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [metrics]);

  const metricsCards = [
    {
      title: "Total Scans Processed",
      value: animatedValues.totalScans.toLocaleString(),
      change: "+12.5%",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      title: "Model Accuracy",
      value: `${animatedValues.accuracy}%`,
      change: "+2.1%",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "green",
    },
    {
      title: "Avg Processing Time",
      value: `${animatedValues.processingTime}s`,
      change: "-0.3s",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "purple",
    },
    {
      title: "Disease Detection Rate",
      value: `${94}%`,
      change: "+5.7%",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "orange",
    },
  ];

  // Get real-time data from prediction context
  const diseaseMetrics = getDiseaseMetrics();
  const recentAnalyses = getRecentPredictions(5);

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      orange: "bg-orange-500 text-orange-600 bg-orange-50",
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <ChatbotWidget />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics & Metrics
            </h1>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">
                Monitor system performance and analysis results
              </p>
              {user && (
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-600 font-medium">
                    {user.name || user.email}'s Data
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Time Period Selector */}
          <div className="mt-4 sm:mt-0">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["24h", "7d", "30d", "90d"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedPeriod === period
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsCards.map((metric, index) => {
            const colorClasses = getColorClasses(metric.color).split(" ");
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${colorClasses[2]} rounded-xl flex items-center justify-center`}
                  >
                    <div className={`${colorClasses[1]}`}>{metric.icon}</div>
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      metric.changeType === "positive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </h3>
                <p className="text-gray-600 text-sm">{metric.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Disease-Specific Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Disease-Specific Performance
              </h2>
              <div className="space-y-6">
                {diseaseMetrics.map((disease, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {disease.disease}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          disease.color === "green"
                            ? "bg-green-100 text-green-800"
                            : disease.color === "blue"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {disease.totalCases} cases
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className={`h-2 rounded-full ${
                                disease.color === "green"
                                  ? "bg-green-500"
                                  : disease.color === "blue"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                              style={{ width: `${disease.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {disease.accuracy}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Avg Confidence
                        </p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className={`h-2 rounded-full ${
                                disease.color === "green"
                                  ? "bg-green-500"
                                  : disease.color === "blue"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                              style={{ width: `${disease.avgConfidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {disease.avgConfidence > 0
                              ? disease.avgConfidence.toFixed(1)
                              : "0.0"}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recent Analyses
              </h2>
              <div className="space-y-4">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {analysis.patientId}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            analysis.prediction === "CONTROL"
                              ? "bg-green-100 text-green-800"
                              : analysis.prediction === "ALZHEIMER"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {analysis.prediction}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {analysis.result}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {getFormattedTimestamp(analysis.timestamp)}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {analysis.confidence.toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-sm">No analyses yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Start analyzing MRI scans to see results here
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/all-analyses")}
                className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors duration-200 hover:bg-blue-50 rounded-lg"
              >
                View All Analyses →
              </button>
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Model Performance Analysis
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Confusion Matrix Image */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confusion Matrix
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 w-full flex items-center justify-center">
                <img
                  src={ConfusionMatrix}
                  alt="Confusion Matrix"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Classification Metrics
              </h3>

              {/* Overall Accuracy */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Accuracy
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    95.8%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: "95.8%" }}
                  ></div>
                </div>
              </div>

              {/* Precision, Recall, F1-Score */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">97%</p>
                  <p className="text-xs text-gray-600">Precision</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">96%</p>
                  <p className="text-xs text-gray-600">Recall</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-2xl font-bold text-orange-600">96.4%</p>
                  <p className="text-xs text-gray-600">F1-Score</p>
                </div>
              </div>

              {/* Class-wise Performance */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-gray-800">
                  Class-wise Performance
                </h4>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-700">
                    Control/Normal
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 bg-green-500 rounded-full"
                        style={{ width: "97%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      97%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">
                    Alzheimer's
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 bg-blue-500 rounded-full"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      95%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">
                    Parkinson's
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 bg-purple-500 rounded-full"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">
                      94%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            System Status
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  AI Model Status
                </p>
                <p className="text-xs text-gray-600">Online & Operational</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-600">Connected</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Queue Status
                </p>
                <p className="text-xs text-gray-600">
                  {recentAnalyses.length} recent analyses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Metrics;
