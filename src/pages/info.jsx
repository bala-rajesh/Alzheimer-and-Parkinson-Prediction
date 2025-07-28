import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatbotWidget from "../components/ChatbotWidget";

const Info = () => {
  const [activeTab, setActiveTab] = useState("alzheimer");
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate('/dashboard/model-test');
  };

  const alzheimerInfo = {
    title: "Alzheimer's Disease",
    description:
      "Alzheimer's disease is a progressive neurologic disorder that causes the brain to shrink (atrophy) and brain cells to die. It's the most common cause of dementia.",
    symptoms: [
      "Memory loss that disrupts daily life",
      "Challenges in planning or solving problems",
      "Difficulty completing familiar tasks",
      "Confusion with time or place",
      "Trouble understanding visual images",
      "New problems with words in speaking or writing",
      "Misplacing things and losing ability to retrace steps",
      "Decreased or poor judgment",
      "Withdrawal from work or social activities",
      "Changes in mood and personality",
    ],
    predictionMethods: [
      {
        method: "Brain imaging (MRI, PET scans)",
        description: "Detects early brain shrinkage or amyloid plaques."
      },
      {
        method: "Biomarker tests (CSF or blood)",
        description: "Measures proteins like amyloid-β and tau."
      },
      {
        method: "Genetic testing",
        description: "Identifies risk genes like APOE ε4."
      },
      {
        method: "Cognitive assessments",
        description: "Early signs detected through memory/thinking tests."
      },
      {
        method: "AI and machine learning tools",
        description: "Predict risk using health data, speech, and behavior."
      }
    ],
    stages: [
      {
        stage: "Early Stage (Mild)",
        description:
          "Person may function independently but is having memory lapses",
        duration: "2-4 years",
      },
      {
        stage: "Middle Stage (Moderate)",
        description:
          "Longest stage, may last for many years. Person may confuse words, get frustrated or angry",
        duration: "2-10 years",
      },
      {
        stage: "Late Stage (Severe)",
        description:
          "Individuals lose ability to respond to environment, carry on conversation, and control movement",
        duration: "1-3 years",
      },
    ],
    riskFactors: [
      "Age (greatest risk factor)",
      "Family history and genetics",
      "Down syndrome",
      "Head trauma",
      "Poor sleep patterns",
      "Lifestyle and heart health",
    ],
    prevention: [
      "Regular physical exercise",
      "Social engagement",
      "Healthy diet",
      "Mental stimulation",
      "Quality sleep",
      "Stress management",
    ],
  };

  const parkinsonInfo = {
    title: "Parkinson's Disease",
    description:
      "Parkinson's disease is a progressive nervous system disorder that affects movement. Symptoms start gradually, sometimes starting with a barely noticeable tremor in just one hand.",
    symptoms: [
      "Tremor (shaking) at rest",
      "Bradykinesia (slowness of movement)",
      "Muscle rigidity or stiffness",
      "Postural instability",
      "Changes in speech",
      "Changes in writing",
      "Loss of automatic movements",
      "Sleep problems",
      "Depression and anxiety",
      "Cognitive changes",
    ],
    predictionMethods: [
      {
        method: "Neurological examination",
        description: "Detects early motor symptoms like tremors or stiffness."
      },
      {
        method: "Dopamine imaging (DaTscan)",
        description: "Shows dopamine loss in brain structures."
      },
      {
        method: "Genetic testing",
        description: "Identifies mutations in genes like LRRK2 or PARK7."
      },
      {
        method: "Olfactory tests (smell tests)",
        description: "Loss of smell can appear years before motor symptoms."
      },
      {
        method: "Digital monitoring (AI, wearables)",
        description: "Tracks subtle movement changes and predicts progression."
      }
    ],
    stages: [
      {
        stage: "Stage 1",
        description:
          "Mild symptoms that don't interfere with daily activities. Tremor and movement symptoms occur on one side of the body",
        duration: "Variable",
      },
      {
        stage: "Stage 2",
        description:
          "Symptoms worsen. Tremor, rigidity, and movement symptoms affect both sides of the body",
        duration: "Variable",
      },
      {
        stage: "Stage 3",
        description:
          "Mid-stage. Loss of balance and slowness of movements. Falls are more common",
        duration: "Variable",
      },
      {
        stage: "Stage 4",
        description:
          "Symptoms are severe and limiting. Person needs help with daily activities",
        duration: "Variable",
      },
      {
        stage: "Stage 5",
        description:
          "Most advanced stage. Person cannot stand or walk and requires wheelchair or is bedridden",
        duration: "Variable",
      },
    ],
    riskFactors: [
      "Age (most common after 60)",
      "Heredity (family history)",
      "Sex (men more likely than women)",
      "Exposure to toxins",
      "Head trauma",
      "Certain medications",
    ],
    prevention: [
      "Regular aerobic exercise",
      "Caffeine consumption",
      "Green tea",
      "Anti-inflammatory foods",
      "Avoiding head injuries",
      "Avoiding exposure to toxins",
    ],
  };

  const currentInfo = activeTab === "alzheimer" ? alzheimerInfo : parkinsonInfo;

  return (
    <>
      <ChatbotWidget />
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Disease Information
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive information about Alzheimer's and Parkinson's diseases
          to help you understand these conditions better.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("alzheimer")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "alzheimer"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Alzheimer's Disease</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("parkinson")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "parkinson"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
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
                <span>Parkinson's Disease</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {/* Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentInfo.title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {currentInfo.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prediction Methods - New Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div
                className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  activeTab === "alzheimer" ? "bg-blue-100" : "bg-purple-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    activeTab === "alzheimer" ? "text-blue-600" : "text-purple-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              Top 5 Prediction Methods
            </h3>
            <div className="space-y-4">
              {currentInfo.predictionMethods.map((method, index) => (
                <div
                  key={index}
                  className={`border-l-4 pl-4 py-3 ${
                    activeTab === "alzheimer"
                      ? "border-blue-500"
                      : "border-purple-500"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {method.method}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div
                className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  activeTab === "alzheimer" ? "bg-blue-100" : "bg-purple-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    activeTab === "alzheimer"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Common Symptoms
            </h3>
            <ul className="space-y-3">
              {currentInfo.symptoms.map((symptom, index) => (
                <li key={index} className="flex items-start">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                      activeTab === "alzheimer"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}
                  />
                  <span className="text-gray-700">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stages */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div
                className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  activeTab === "alzheimer" ? "bg-blue-100" : "bg-purple-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    activeTab === "alzheimer"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
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
              </div>
              Disease Stages
            </h3>
            <div className="space-y-4">
              {currentInfo.stages.map((stage, index) => (
                <div
                  key={index}
                  className={`border-l-4 pl-4 py-3 ${
                    activeTab === "alzheimer"
                      ? "border-blue-500"
                      : "border-purple-500"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {stage.stage}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {stage.description}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === "alzheimer"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    Duration: {stage.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg mr-3 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              Risk Factors
            </h3>
            <ul className="space-y-3">
              {currentInfo.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg mr-3 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
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
              </div>
              Prevention & Management
            </h3>
            <ul className="space-y-3">
              {currentInfo.prevention.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Early Detection is Key</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our AI-powered analysis can help detect early signs of
              neurological diseases. Upload your MRI scans for comprehensive
              analysis and get results within minutes.
            </p>
            <button
              onClick={handleStartAnalysis}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Info;
