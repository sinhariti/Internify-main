import React, { useState } from 'react';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';

const parseCsv = (text) => {
	const lines = String(text)
	.split(/\r?\n/)
	.map((l) => l.trim())
	.filter(Boolean);
	if (lines.length === 0) return [];

	// Try header detection
	const first = lines[0].toLowerCase();
	const hasHeader = /(course|subject|code).*|(credit|cr)\b.*|(grade|gp)/.test(first);
	const rows = hasHeader ? lines.slice(1) : lines;

	return rows.map((line) => {
		const parts = line.split(/[,;\t]/).map(p => p.trim());
		// Heuristic: look for credits numeric and grade (letter or numeric)
		let credits = 0;
		let grade = '';
		for (const p of parts) {
			if (!credits && /^\d+(\.\d+)?$/.test(p)) credits = parseFloat(p);
		}
		// grade often last non-empty segment
		const reversed = [...parts].reverse();
		grade = reversed.find(p => p.length > 0) || '';
		return { credits, grade };
	}).filter(r => r.credits > 0);
};

const gradeToPoints = (gradeRaw) => {
	if (gradeRaw == null) return 0;
	const g = String(gradeRaw).trim().toUpperCase();
	// Numeric grade point
	if (/^\d+(\.\d+)?$/.test(g)) return parseFloat(g);
	// Common letter scales (10-point tilt + 4.0 scale)
	const map = {
		'O': 10, 'S': 10, 'A+': 10, 'EX': 10,
		'A': 9, 'A-': 8.5,
		'B+': 8, 'B': 8, 'B-': 6.5,
		'C+': 6, 'C': 7, 'C-': 4.5,
		'D': 6, 'E': 5,
		'P': 4, 'PASS': 4,
		'F': 0, 'FAIL': 0, 'AB': 0, 'RA': 0
	};
	return map[g] ?? 0;
};

const CgpaCalculator = () => {
	const [user] = useState(() => {
		try {
			const stored = localStorage.getItem('internify-user');
			return stored ? JSON.parse(stored) : null;
		} catch { return null; }
	});
	const [fileName, setFileName] = useState('');
	const [parsed, setParsed] = useState([]);
	const [cgpa, setCgpa] = useState(null);
	const [error, setError] = useState('');

	const handleLogout = () => {
		localStorage.clear();
		window.location.href = '/login';
	};

	const onFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError('');
		setFileName(file.name);
		if (!/\.(csv|txt)$/i.test(file.name)) {
			setError('Please upload a CSV or TXT file with: course, credits, grade');
			setParsed([]);
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const rows = parseCsv(String(reader.result || ''));
				setParsed(rows);
				setCgpa(null);
			} catch {
				setError('Could not parse file. Ensure it is a comma-separated list with credits and grade.');
			}
		};
		reader.readAsText(file);
	};

	const calculate = () => {
		if (!parsed.length) {
			setError('No valid rows found to calculate.');
			return;
		}
		let totalCredits = 0;
		let totalPoints = 0;
		for (const r of parsed) {
			const gp = gradeToPoints(r.grade);
			totalCredits += r.credits;
			totalPoints += gp * r.credits;
		}
		if (totalCredits === 0) {
			setError('Total credits is zero.');
			return;
		}
		setError('');
		setCgpa(totalPoints / totalCredits);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<SideNav user={user} handleLogout={handleLogout} />
			<Header user={user} handleLogout={handleLogout} />

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<h1 className="text-5xl font-extrabold text-gray-900">CGPA Calculator</h1>
				<p className="mt-2 text-gray-600">Upload your university transcript (PDF/CSV/TXT) to estimate your CGPA.</p>

				<div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center space-x-3 mb-6">
						<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
							<span className="text-xl">🎓</span>
						</div>
						<h2 className="text-3xl font-bold text-gray-900">Upload Transcript</h2>
					</div>

					<div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 flex items-center justify-between">
						<div className="flex items-center space-x-3 text-gray-600">
							<div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">📥</div>
							<div>
								<p className="font-medium">Drag and drop file here</p>
								<p className="text-sm text-gray-500">CSV or TXT • columns: Course, Credits, Grade</p>
								{fileName && <p className="text-sm text-gray-700 mt-1">Selected: {fileName}</p>}
							</div>
						</div>
						<label className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 cursor-pointer">
							Browse files
							<input type="file" accept=".csv,.txt" className="hidden" onChange={onFileChange} />
						</label>
					</div>

					{error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

					<div className="mt-6 text-sm text-gray-500">
						<p className="font-medium">Example CSV</p>
						<pre className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200 overflow-auto">{`Course,Credits,Grade\nMath 101,4,A\nPhysics,3,B+\nChemistry,3,8`}</pre>
					</div>

					<div className="mt-8 flex flex-col sm:flex-row gap-4">
						<button onClick={calculate} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Calculate CGPA</button>
					</div>

					{cgpa != null && (
						<div className="mt-8 p-4 rounded-xl bg-green-50 border border-green-200">
							<p className="text-green-800 font-semibold">Estimated CGPA: <span className="text-2xl">{cgpa.toFixed(2)}</span></p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CgpaCalculator;
