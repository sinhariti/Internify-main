import React, { useState } from 'react';
import CardNav from '@/components/CardNav';
import { FileScan, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import {
  processResume,
  analyzeResume,
  generateCoverLetter,
  rephraseText
} from '../api/api';


const AtsAnalyser = () => {
	const [user] = useState(() => {
			try {
				const stored = localStorage.getItem("internify-user");
				return stored ? JSON.parse(stored) : null;
			} catch {
				return null;
			}
		});
  const [jd, setJd] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [rephraseTextInput, setRephraseTextInput] = useState("");
  const [rephrasedResult, setRephrasedResult] = useState("");
  const [loading, setLoading] = useState({
    analyze: false,
    coverLetter: false,
    rephrase: false
  });
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [currentView, setCurrentView] = useState('analyzer'); // For navigation

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleNavigation = (view) => {
    if (view === "dashboard") {
      window.location.href = "/dashboard";
    } else if (view === "profile") {
      window.location.href = "/profile";
    }
  };


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset status
    setUploadStatus({ type: '', message: '' });

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadStatus({ type: 'error', message: 'Please upload a PDF file only' });
      return;
    }

    // Validate file size (limit to 5MB for demo)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'File size must be less than 5MB' });
      return;
    }

    setResumeFile(file);
    setParsedResume(null);
    setUploadStatus({ type: 'success', message: 'File uploaded successfully' });
    setAnalysisResult('');
    setCoverLetter('');
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setUploadStatus({ type: 'error', message: 'Please upload a resume first' });
      return;
    }

    if (!jd.trim()) {
      setUploadStatus({ type: 'error', message: 'Please provide a job description' });
      return;
    }

    setLoading({ ...loading, analyze: true });
    setAnalysisResult("");
    setCoverLetter("");

    try {
      setUploadStatus({ type: 'info', message: 'Processing resume...' });

      // Process resume
      const processResult = await processResume(resumeFile);
      const parsedResumeText = processResult.parsed_resume;
      setParsedResume(parsedResumeText);

      setUploadStatus({ type: 'info', message: 'Analyzing resume...' });

      // Analyze resume with job description
      const analysis = await analyzeResume(parsedResumeText, jd);
      console.log(analysis);
      setAnalysisResult(analysis.analysis);
      setUploadStatus({ type: 'success', message: 'Resume analyzed successfully' });
    } catch (error) {
      console.error("Error processing resume:", error);
      setUploadStatus({ type: 'error', message: error.message || 'Error processing resume' });
      setAnalysisResult(`Error: ${error.message}\n\nPlease try again with a different resume file.`);
    } finally {
      setLoading({ ...loading, analyze: false });
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeFile || !jd) {
      setUploadStatus({ type: 'error', message: 'Please upload a resume and provide a job description first' });
      return;
    }

    setLoading({ ...loading, coverLetter: true });
    setCoverLetter("");

    try {
      setUploadStatus({ type: 'info', message: 'Generating cover letter...' });

      // If we haven't parsed the resume yet, do it now
      let resumeText = parsedResume;
      if (!resumeText) {
        const processResult = await processResume(resumeFile);
        resumeText = processResult.parsed_resume;
        setParsedResume(resumeText);
      }

      // Generate cover letter
      const coverLetterResult = await generateCoverLetter(resumeText, jd);

      setCoverLetter(coverLetterResult.cover_letter);
      setUploadStatus({ type: 'success', message: 'Cover letter generated successfully' });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setUploadStatus({ type: 'error', message: error.message || 'Error generating cover letter' });
      setCoverLetter(`Error: ${error.message}\n\nPlease try again.`);
    } finally {
      setLoading({ ...loading, coverLetter: false });
    }
  };

  const handleRephrase = async () => {
    if (!rephraseTextInput.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter some text to rephrase' });
      return;
    }

    setLoading({ ...loading, rephrase: true });

    try {
      setUploadStatus({ type: 'info', message: 'Rephrasing text...' });

      // Rephrase text
      const rephrased = await rephraseText(rephraseTextInput);

      setRephrasedResult(rephrased.rephrased_text);
      setUploadStatus({ type: 'success', message: 'Text rephrased successfully' });
    } catch (error) {
      console.error("Error rephrasing text:", error);
      setUploadStatus({ type: 'error', message: error.message || 'Error rephrasing text' });
      setRephrasedResult(`Error: ${error.message}\n\nPlease try again.`);
    } finally {
      setLoading({ ...loading, rephrase: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CardNav user={user} handleLogout={handleLogout} handleNavigation={handleNavigation} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ paddingTop: '7rem' }}>
        <h1 className="text-5xl font-extrabold text-gray-900">Smart ATS</h1>
        <p className="mt-2 text-gray-600">Improve Your Resume ATS</p>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-xl"><FileScan /></span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">ATS Resume Analyzer</h2>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">Paste the Job Description</label>
          <textarea
            rows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="w-full resize-y rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-gray-50"
            placeholder="Paste the role description here..."
          />

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Your Resume</label>
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">☁️</div>
                <div>
                  <p className="font-medium">Drag and drop file here</p>
                  <p className="text-sm text-gray-500">Limit 200MB per file • PDF</p>
                </div>
              </div>
              <label
                htmlFor="resumeFile"
                className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                {resumeFile ? resumeFile.name : "Choose file"}
              </label>
              <input
                type="file"
                id="resumeFile"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              {/* <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
                Browse files
              </button> */}
            </div>
            {uploadStatus.message && (
              <div className={`mt-3 flex items-center space-x-2 ${uploadStatus.type === 'error' ? 'text-red-600' : uploadStatus.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
                {uploadStatus.type === 'error' ? <AlertCircle size={18} /> : uploadStatus.type === 'success' ? <CheckCircle size={18} /> : null}
                <span className="text-sm">{uploadStatus.message}</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading.analyze || !resumeFile || !jd}
            >
              {loading.analyze ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Resume'
              )}
            </button>
            <button
              onClick={handleGenerateCoverLetter}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading.coverLetter || !resumeFile || !jd}
            >
              {loading.coverLetter ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Cover Letter'
              )}
            </button>
          </div>
					{analysisResult && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Analysis Result:</h3>
              <pre className="whitespace-pre-wrap break-words bg-white p-4 rounded-lg border">{analysisResult}</pre>
            </div>
          )}

          {coverLetter && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Generated Cover Letter:</h3>
              <pre className="whitespace-pre-wrap break-words bg-white p-4 rounded-lg border">{coverLetter}</pre>
            </div>
          )}
        </div>
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-2">✍️ Rephrase Any Text</h2>
          <div className="mt-10">

            <textarea
              rows={4}
              value={rephraseTextInput}  
              onChange={(e) => setRephraseTextInput(e.target.value)}
              className="w-full resize-y rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-gray-50"
              placeholder="Enter text to rephrase"
            />
            <button
              onClick={handleRephrase}
              className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading.rephrase || !rephraseTextInput}
            >
              {loading.rephrase ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Rephrasing...
                </span>
              ) : (
                'Rephrase Text'
              )}
            </button>

            {rephrasedResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Rephrased Text:</h3>
                <pre className="whitespace-pre-wrap break-words bg-white p-4 rounded-lg border">{rephrasedResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsAnalyser;
