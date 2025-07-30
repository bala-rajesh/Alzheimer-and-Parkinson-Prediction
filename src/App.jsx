import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PredictionProvider } from "./contexts/PredictionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Info from "./pages/info";
import Metrics from "./pages/Metrics";
import ModelTest from "./pages/ModelTest";
import AllAnalyses from "./pages/AllAnalyses";

function App() {
  return (
    <AuthProvider>
      <PredictionProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ModelTest />} />
                <Route path="model-test" element={<ModelTest />} />
                <Route path="metrics" element={<Metrics />} />
                <Route path="info" element={<Info />} />
              </Route>
              <Route
                path="/all-analyses"
                element={
                  <ProtectedRoute>
                    <AllAnalyses />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </PredictionProvider>
    </AuthProvider>
  );
}

export default App;
