import React, { useState } from 'react';
import { X, Mic, Volume2, MessageSquareText, Check, Clock } from 'lucide-react';

import MockInterview from './MockInterview';

const QuestionsModal = ({
  appId,
  onClose,
  onGenerate,
  questionsLoading,
  generatedQuestions,
  setGeneratedQuestions,
  jobDescriptionInput,
  setJobDescriptionInput
}) => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  if (isInterviewStarted) {
    return <MockInterview appId={appId} onClose={() => setIsInterviewStarted(false)} generatedQuestions={generatedQuestions} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Interview Questions Generator</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate personalized interview questions and practice with AI
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setGeneratedQuestions('');
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {questionsLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-blue-700 font-semibold text-lg">Generating personalized questions...</span>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Input form for JD */}
              <div className="bg-gray-50 rounded-xl p-6">
                <label htmlFor="jobDescription" className="block text-lg font-semibold text-gray-800 mb-3">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  rows="10"
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 p-4 resize-none"
                  placeholder="Paste the complete job description here to generate tailored interview questions..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Tip: Include all details like requirements, responsibilities, and company info for better questions
                </p>
              </div>
              
              <button
                onClick={() => onGenerate(appId, jobDescriptionInput)}
                disabled={!jobDescriptionInput || questionsLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {questionsLoading ? 'Generating...' : '✨ Generate Interview Questions'}
              </button>
              
              {generatedQuestions && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <MessageSquareText className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Your Personalized Interview Questions</h3>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm max-h-96 overflow-y-auto border">
                    <div className="prose max-w-none text-gray-800">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{generatedQuestions}</pre>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Questions generated successfully</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Ready for practice</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsInterviewStarted(true)}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start AI Mock Interview</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsModal;