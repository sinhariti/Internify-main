import React, { useState } from 'react';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import { FileScan } from 'lucide-react';

const AtsAnalyser = () => {
	const [user] = useState(() => {
		try {
			const stored = localStorage.getItem('internify-user');
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	});

	const handleLogout = () => {
		localStorage.clear();
		window.location.href = '/login';
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<SideNav user={user} handleLogout={handleLogout} />
			<Header user={user} handleLogout={handleLogout} />

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
							<button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
								Browse files
							</button>
						</div>
					</div>

					<div className="mt-8 flex flex-col sm:flex-row gap-4">
						<button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Analyze Resume</button>
						<button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">Generate Cover Letter</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AtsAnalyser;
