import React from 'react';
import { Briefcase, User, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = ({ user, handleLogout, onProfileClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Internify
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">{user?.name || user?.email}</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;