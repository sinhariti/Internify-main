import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import { X, Mic, StopCircle, Volume2 } from 'lucide-react';
import { toast } from 'react-toastify';

const MockInterview = ({ appId, onClose, generatedQuestions }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [aiFeedback, setAiFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
            setError('Your browser does not support the Web Speech API. Please use Google Chrome or a similar browser.');
            toast.error('Your browser does not support speech recognition.');
            return;
        }

        // Initialize recognitionRef only once
        if (!recognitionRef.current) {
            recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserAnswer(transcript);
                evaluateAnswer(transcript);
            };
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError('Speech recognition error: ' + event.error);
                setIsListening(false);
            };
        }

        // Cleanup function
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        const initializeQuestions = async () => {
            if (hasInitializedRef.current) return;
            hasInitializedRef.current = true;
            
            setLoading(true);
            try {
                let fetchedQuestions;
                if (generatedQuestions) {
                    fetchedQuestions = generatedQuestions.split('\n').filter(q => q.trim().length > 0);
                } else {
                    const response = await api.startMockInterview(appId);
                    const data = await response.json();
                    if (response.ok) {
                        fetchedQuestions = data.questions;
                    } else {
                        setError('Failed to start interview session. ' + (data.message || 'Server error.'));
                        toast.error('Failed to start interview session.');
                        onClose();
                        return;
                    }
                }
                
                if (fetchedQuestions && fetchedQuestions.length > 0) {
                    setQuestions(fetchedQuestions);
                    speakQuestion(fetchedQuestions[0]);
                } else {
                    setError('No questions available for this application.');
                    toast.error('No questions available.');
                    onClose();
                }
            } catch (err) {
                setError('Network error. Failed to start session.');
                toast.error('Network error. Failed to start session.');
                onClose();
            } finally {
                setLoading(false);
            }
        };

        initializeQuestions();
    }, [appId, generatedQuestions, onClose]);

    const speakQuestion = (question) => {
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.onend = () => {
            // Automatically start listening after the question is spoken
            startListening();
        };
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    const evaluateAnswer = async (answer) => {
        setLoading(true);
        try {
            const response = await api.evaluateAnswer(appId, questions[currentQuestionIndex], answer);
            const data = await response.json();
            if (response.ok) {
                setAiFeedback(data);
                speakFeedback(data.feedback);
            } else {
                setAiFeedback({ score: 0, feedback: "Failed to get feedback from AI." });
                toast.error("Failed to get feedback from AI.");
            }
        } catch (err) {
            setAiFeedback({ score: 0, feedback: "Network error during evaluation." });
            toast.error("Network error during evaluation.");
        } finally {
            setLoading(false);
        }
    };

    const speakFeedback = (feedback) => {
        const utterance = new SpeechSynthesisUtterance(feedback);
        window.speechSynthesis.speak(utterance);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserAnswer('');
            setAiFeedback(null);
            setError(null);
            // The useEffect will now trigger the next question to be spoken
        } else {
            toast.info("Interview finished!");
            onClose();
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <p className="text-gray-700 font-semibold">Loading interview session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Error</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        );
    }
    
    const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : "No questions available.";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform">
                {/* Fixed Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI Mock Interview</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Question {currentQuestionIndex + 1} of {questions.length} • Practice with AI feedback
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>

                        {/* Current Question */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                    {currentQuestionIndex + 1}
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Interview Question</h3>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <p className="text-gray-700 text-lg leading-relaxed">{currentQuestion}</p>
                            </div>
                            <button 
                                onClick={() => speakQuestion(currentQuestion)} 
                                className="mt-4 text-blue-600 hover:text-blue-800 flex items-center space-x-2 font-medium transition-colors"
                            >
                                <Volume2 className="w-5 h-5"/> 
                                <span>Listen to Question</span>
                            </button>
                        </div>
                        
                        {/* Voice Recording Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-800 mb-4">Record Your Answer</h4>
                            <div className="flex items-center space-x-4 mb-4">
                                <button 
                                    onClick={isListening ? stopListening : startListening} 
                                    className={`p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                                        isListening 
                                            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white shadow-lg`}
                                >
                                    {isListening ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                                </button>
                                <div className="flex-1">
                                    <div className={`text-lg font-medium transition-colors ${
                                        isListening ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        {isListening ? 'Recording... Speak clearly!' : 'Click the microphone to start recording'}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isListening ? 'Click stop when you finish answering' : 'Make sure your microphone is enabled'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* User Answer Display */}
                        {userAnswer && (
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                                    <Mic className="w-5 h-5" />
                                    <span>Your Recorded Answer</span>
                                </h4>
                                <div className="bg-white rounded-lg p-4 shadow-sm border">
                                    <p className="text-gray-700 italic leading-relaxed">"{userAnswer}"</p>
                                </div>
                            </div>
                        )}

                        {/* AI Feedback Section */}
                        {aiFeedback && (
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                <h4 className="font-semibold text-green-800 mb-4 flex items-center space-x-2">
                                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                        AI
                                    </div>
                                    <span>AI Feedback & Scoring</span>
                                </h4>
                                <div className="bg-white rounded-lg p-4 shadow-sm border space-y-4">
                                    {/* Score Display */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600 font-medium">Score:</span>
                                            <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                                                aiFeedback.score >= 8 ? 'bg-green-100 text-green-800' :
                                                aiFeedback.score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {aiFeedback.score}/10
                                            </div>
                                        </div>
                                    </div>
                                    {/* Feedback Text */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="text-gray-700 leading-relaxed">{aiFeedback.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 p-6 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {aiFeedback ? 'Ready for next question' : 'Record your answer to continue'}
                        </div>
                        <button 
                            onClick={nextQuestion} 
                            disabled={loading || !aiFeedback} 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Interview'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterview;