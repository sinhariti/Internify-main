import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Internify from './pages/Internify';
import HomePage from './components/HomePage';
import AtsAnalyser from './pages/AtsAnalyser';
import CgpaCalculator from './pages/cgpaCalculator';

const MainApp = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Internify initialView="login" />} />
      <Route path="/signup" element={<Internify initialView="signup" />} />
      <Route path="/dashboard" element={<Internify initialView="dashboard" />} />
      <Route path="/profile" element={<Internify initialView="profile" />} />
      <Route path="/ats-analyser" element={<AtsAnalyser />} />
      <Route path="/cgpa-calculator" element={<CgpaCalculator />} />
      {/* All other routes redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
