import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../api/api';

const Auth = ({ currentView, setCurrentView, onAuthSuccess, error, setError, loading, setLoading }) => {
  const navigate = useNavigate();
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    showPassword: false,
  });
  // State to track if OTP has been sent
  const [isOtpSent, setIsOtpSent] = useState(false);
  // State to store the OTP entered by the user
  const [otp, setOtp] = useState('');

  const handleAuth = async (isLogin) => {
    setLoading(true);
    setError('');

    // Client-side validation
    if (!authForm.email || !authForm.password || (!isLogin && !authForm.name)) {
      let errorMessage = '';
      if (!authForm.email) {
        errorMessage = 'Email address is required.';
      } else if (!authForm.password) {
        errorMessage = 'Password is required.';
      } else if (!isLogin && !authForm.name) {
        errorMessage = 'Full name is required for registration.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authForm.email)) {
      const errorMessage = 'Please enter a valid email address.';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Password length validation
    if (authForm.password.length < 6) {
      const errorMessage = 'Password must be at least 6 characters long.';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }
    
    // Determine which API endpoint to call based on isLogin and OTP state
    const endpoint = isLogin ? 'login' : 'signupSendOtp';
    const body = isLogin ? { email: authForm.email, password: authForm.password } : authForm;
    
    try {
      const response = await api[endpoint](body);
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
            onAuthSuccess(data, true);
        } else {
            // If signup is successful, set OTP state and show toast
            setIsOtpSent(true);
            toast.success('OTP sent! Please check your email.');
        }
      } else {
        let errorMessage = 'Authentication failed';
        if (response.status === 400) {
            if (data.message && Array.isArray(data.errors)) {
                const validationErrors = data.errors.map(err => err.defaultMessage).join(' ');
                errorMessage = validationErrors;
            } else if (data.message) {
                errorMessage = data.message;
            }
        } else if (response.status === 401) {
            errorMessage = data.message || 'Invalid email or password.';
        } else if (response.status === 409) {
            errorMessage = data.message || 'Email already exists. Please use a different email or try logging in.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpVerification = async () => {
    setLoading(true);
    setError('');
    
    // Client-side OTP validation
    if (!otp) {
        setError('OTP is required.');
        setLoading(false);
        return;
    }

    try {
        const response = await api.signupVerifyOtp({ email: authForm.email, otp });
        const data = await response.json();
        if (response.ok) {
            onAuthSuccess(data, false);
        } else {
            setError(data.message || 'OTP verification failed');
            toast.error(data.message || 'OTP verification failed');
        }
    } catch (err) {
        setError('Network error. Please try again.');
        toast.error('Network error. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    if (currentView === 'signup' && isOtpSent) {
        handleOtpVerification();
    } else {
        handleAuth(currentView === 'login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-8">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() => navigate('/')}
            >
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => navigate('/')}
            >
              Internify
            </h1>
            <p className="text-gray-600 mt-2">Track your internship applications</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-pulse">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Conditional rendering for signup form and OTP field */}
            {currentView === 'signup' && !isOtpSent ? (
              <>
                <div className="transform transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="transform transition-all duration-300">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="relative transform transition-all duration-300">
                  <input
                    type={authForm.showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setAuthForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {authForm.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </>
            ) : currentView === 'signup' && isOtpSent ? (
                // Render OTP verification field
                <div className="transform transition-all duration-300">
                  <p className="text-sm text-gray-600 mb-2">An OTP has been sent to your email. Please enter it below to complete your registration.</p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
            ) : (
                // Login form
                <>
                <div className="transform transition-all duration-300">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="relative transform transition-all duration-300">
                  <input
                    type={authForm.showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setAuthForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {authForm.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </>
            )}

            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isOtpSent ? 'Verify OTP' : (currentView === 'login' ? 'Sign In' : 'Sign Up'))}
            </button>

            <div className="text-center">
              <button
                onClick={() => {
                  const newView = currentView === 'login' ? 'signup' : 'login';
                  setCurrentView(newView);
                  navigate(newView === 'login' ? '/login' : '/signup');
                  setIsOtpSent(false);
                  setAuthForm({
                    email: '',
                    password: '',
                    name: '',
                    showPassword: false,
                  });
                  setOtp('');
                  setError('');
                }}
                className="text-blue-600 hover:text-purple-600 transition-colors duration-300"
              >
                {currentView === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;