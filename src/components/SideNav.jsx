import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, FileText, FileScan, Sigma, HelpCircle, LogOut, User } from 'lucide-react';

const SideNav = ({ user, handleLogout, handleNavigation }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', action: () => {
      if (handleNavigation) {
        handleNavigation('dashboard');
      } else {
        navigate('/dashboard');
      }
      setIsNavOpen(false);
    }},
    { icon: FileText, label: 'Applications', action: () => {
      if (handleNavigation) {
        handleNavigation('dashboard');
      } else {
        navigate('/dashboard');
      }
      setIsNavOpen(false);
    }},
    { icon: FileScan, label: 'Ats Analyser', action: () => {
      navigate('/ats-analyser');
      setIsNavOpen(false);
    }},
    { icon: Sigma, label: 'Cgpa Calculator', action: () => {
      navigate('/cgpa-calculator');
      setIsNavOpen(false);
    }},
    { icon: User, label: 'Profile', action: () => {
      if (handleNavigation) {
        handleNavigation('profile');
      } else {
        navigate('/profile');
      }
      setIsNavOpen(false);
    }},
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help clicked') },
    { icon: LogOut, label: 'Logout', action: () => {
      handleLogout();
      setIsNavOpen(false);
    }},
  ];

  return (
    <>
      {/* Navigation Toggle Button */}
      <button
        onClick={() => setIsNavOpen(true)}
        className="fixed top-3 left-4 z-40 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Side Navigation Modal */}
      {isNavOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-xs z-50 transition-opacity duration-300"
            onClick={() => setIsNavOpen(false)}
          />

          {/* Navigation Panel */}
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-lg p-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Internify</h2>
                  <p className="text-blue-100 text-sm">Welcome, {user?.name || 'User'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsNavOpen(false)}
                className="p-2 text-white hover:bg-purple-500 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="py-6">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                const isLogout = item.label === 'Logout';

                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsNavOpen(false);
                    }}
                    className={`w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      isLogout ? 'border-t border-gray-200 mt-4 text-red-600 hover:bg-red-50' : 'text-gray-700'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isLogout ? 'text-red-500' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-center text-sm text-gray-500">
                <p>Internify Dashboard</p>
                <p className="text-xs mt-1">Track your internship journey</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideNav;
