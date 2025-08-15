# 🧠 Alzhiemer and Parkinson Prediction 

This project is a comprehensive web application designed to assist in the prediction and analysis of medical conditions, specifically focusing on Alzheimer's and Parkinson's diseases. It provides a user-friendly interface for uploading medical images, receiving predictions from an AI model, and viewing detailed metrics and information related to these diseases. The application aims to empower healthcare professionals and researchers with tools for early detection and improved understanding of these conditions.

🚀 **Key Features**

*   **User Authentication:** Secure user registration, login, and logout functionality to protect sensitive data.
*   **Image Upload & Prediction:** Allows users to upload medical images and receive predictions from an integrated AI model.
*   **Comprehensive Dashboard:** Provides an overview of key metrics, recent analyses, and disease-specific information.
*   **Detailed Metrics:** Displays key performance indicators (KPIs) related to the AI model's performance, such as accuracy, processing time, and detection rates.
*   **Disease Information:** Offers detailed information about Alzheimer's and Parkinson's diseases, including symptoms, prediction methods, and stages.
*   **Analysis History:** Maintains a history of all analyses performed, allowing users to review past predictions.
*   **Report Generation:** Enables users to generate PDF reports based on prediction data.
*   **Chatbot Integration:** Includes a chatbot widget for user support and information retrieval.
*   **Protected Routes:** Ensures that only authenticated users can access sensitive areas of the application.
*   **Data Persistence:** Stores prediction history in localStorage for user-specific data isolation.

🛠️ **Tech Stack**

*   **Frontend:**
    *   React
    *   React Router DOM
    *   Tailwind CSS
    *   Vite
*   **Backend (API):**
    *   (Assumed - based on `apiService.js`) Node.js with Express or similar framework
*   **AI Model:**
    *   (Assumed - details not provided, but integrated via API) Python with TensorFlow/PyTorch
*   **State Management:**
    *   React Context API (AuthContext, PredictionContext)
*   **Build Tool:**
    *   Vite
*   **PDF Generation:**
    *   jsPDF
*   **Other:**
    *   ESLint
    *   axios

📦 **Getting Started / Setup Instructions**

**Prerequisites**

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   A backend API server (details of setup not provided, but required for full functionality)

**Installation**

1.  Clone the repository:
    ```bash
    git clone <https://github.com/bala-rajesh/Alzheimer-and-Parkinson-Prediction>
    cd <project_directory>
    ```

2.  Install dependencies:
    ```bash
    npm install # or yarn install
    ```

**Running Locally**

1.  Start the development server:
    ```bash
    npm run dev # or yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

📂 **Project Structure**

```
├── vite.config.js         # Vite configuration file
├── package.json           # Project metadata and dependencies
├── index.html             # Main HTML file
├── .eslintrc.cjs          # ESLint configuration
├── src
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point for React application
│   ├── index.css          # Global styles
│   ├── components
│   │   ├── ProtectedRoute.jsx # Component for protecting routes
│   │   └── ChatbotWidget.jsx  # Chatbot widget component
│   ├── contexts
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── PredictionContext.jsx # Prediction context
│   ├── pages
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Signup page
│   │   ├── Dashboard.jsx    # Dashboard page
│   │   ├── Info.jsx         # Information page
│   │   ├── Metrics.jsx      # Metrics page
│   │   ├── ModelTest.jsx    # Model Test page
│   │   └── AllAnalyses.jsx  # All Analyses page
│   ├── services
│   │   └── api.js           # API service for making requests
│   └── assets
│       └── ConfusionMatrix.png # Confusion Matrix Image
```

📸 **Screenshots**

<img width="1904" height="837" alt="Image" src="https://github.com/user-attachments/assets/36878639-4345-4673-915f-a72b72abbd11" />








<img width="1919" height="855" alt="Image" src="https://github.com/user-attachments/assets/8b4342c2-a075-4f01-8cb2-c248a29486ef" />









<img width="1916" height="860" alt="Image" src="https://github.com/user-attachments/assets/2e842cdf-6418-47c9-be58-fc4891107d96" />

🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

📝 **License**

This project is licensed under the [MIT License](LICENSE).

📬 **Contact**

If you have any questions or suggestions, please feel free to contact us at [kunapareddybalarajesh@gmail.com](mailto:kunapareddybalarajesh@gmail.com).

💖 **Thanks Message**

Thank you for checking out this project! We hope it's helpful and we appreciate any feedback you may have.


