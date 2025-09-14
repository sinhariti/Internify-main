import React from "react";
import { Briefcase, ArrowRight, BarChart3, FileText, Bell, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-0"
    >
      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col items-start justify-center mb-12 md:mb-0 md:mr-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-24 rounded-2xl flex items-center justify-center mb-8 animate-popIn">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          {/* <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fadeIn">
            Internify
          </h1> */}
          <p className="text-2xl text-gray-700 mb-8 animate-fadeIn max-w-xl">
            The modern way to track, manage, and win your dream internship. Organize every application, get smart reminders, and visualize your journey—all in one beautiful dashboard.
          </p>
          <div className="flex space-x-6 animate-fadeIn">
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Login</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex-1 flex items-center justify-center w-full"
        >
          <img
            src="/vite.svg"
            alt="Internify dashboard preview"
            className="rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fadeIn"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-16 px-4 md:px-0 border-t border-b border-gray-100 animate-fadeIn">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm bg-blue-50">
            <BarChart3 className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">Visual Analytics</h3>
            <p className="text-gray-500">See your progress, success rate, and deadlines at a glance with beautiful charts.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm bg-purple-50">
            <FileText className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-xl font-bold text-purple-700 mb-2">Resume Management</h3>
            <p className="text-gray-500">Upload, store, and attach resumes to each application for easy access and sharing.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm bg-yellow-50">
            <Bell className="w-10 h-10 text-yellow-600 mb-3" />
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Smart Reminders</h3>
            <p className="text-gray-500">Never miss a deadline with timely reminders and notifications for every stage.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm bg-green-50">
            <Users className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-green-700 mb-2">Collaborate</h3>
            <p className="text-gray-500">Share your progress with mentors or friends and get feedback on your journey.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Ready to land your dream internship?</h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
          Join Internify today and take control of your internship journey. Sign up for free and start tracking your applications in seconds.
        </p>
        <Button
          onClick={() => navigate("/signup")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg flex items-center space-x-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </section>
      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 1s ease; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(.4,2,.6,1); }
        .animate-popIn { animation: popIn 0.7s cubic-bezier(.4,2,.6,1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
      `}</style>
    </motion.div>
  );
};

export default HomePage;