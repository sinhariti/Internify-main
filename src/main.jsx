import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InternifyLogin from './components/InternifyLogin';
import InternifySignup from './components/InternifySignup';
import HomePage from './components/HomePage';
import AtsAnalyser from './pages/AtsAnalyser';
import CgpaCalculator from './pages/cgpaCalculator';

const MainApp = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<InternifyLogin />} />
      <Route path="/signup" element={<InternifySignup />} />
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
