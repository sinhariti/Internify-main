import React from 'react';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';

const Help = () => {
  const user = (() => {
    try {
      const s = localStorage.getItem('internify-user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const Section = ({ title, children }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed text-sm">{children}</div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav user={user} handleLogout={handleLogout} />
      <div className="sticky top-0 z-30 bg-white">
        <Header user={user} handleLogout={handleLogout} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Help & Support</h1>
          <p className="mt-2 text-gray-600">Learn how to make the most of Internify.</p>
        </div>

        <Section title="Dashboard">
          <ul className="list-disc pl-6 space-y-2">
            <li>Quick overview of your applications and status cards.</li>
            <li>Search and filter to find applications fast.</li>
            <li>Add, edit, and track notes for each application.</li>
          </ul>
        </Section>

        <Section title="Applications">
          <ul className="list-disc pl-6 space-y-2">
            <li>Add a new application with company, role, dates, and job link.</li>
            <li>Upload a resume to an application and manage statuses like Applied, Interviewing, Offer, Rejected.</li>
            <li>Edit an application inline and save changes.</li>
          </ul>
        </Section>

        <Section title="ATS Resume Analyzer">
          <ul className="list-disc pl-6 space-y-2">
            <li>Paste a job description and upload your resume (PDF) to analyze ATS compatibility.</li>
            <li>Use generated feedback to tailor your resume for higher match scores.</li>
          </ul>
        </Section>

        <Section title="CGPA Calculator">
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload a transcript as PDF to compute CGPA via the backend gradesheet parser.</li>
            <li>Or upload CSV/TXT with Course, Credits, and Grade to compute locally.</li>
            <li>Click "Calculate CGPA" to process and view your result.</li>
          </ul>
        </Section>

        <Section title="Mock Interview & Questions">
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate interview questions for an application.</li>
            <li>Start a mock interview session and get feedback on your answers.</li>
          </ul>
        </Section>

        <Section title="Tips & Troubleshooting">
          <ul className="list-disc pl-6 space-y-2">
            <li>Keep your browser logged in; Internify uses a local token for API calls.</li>
            <li>If uploads fail, check file type and size. PDFs are preferred for transcripts and resumes.</li>
            <li>For any persistent issues, try logging out and back in.</li>
          </ul>
        </Section>

        <Section title="Support">
          <p className="mb-3">For help or any feature recommendation, you can reach any of our team members:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{
              name: 'Riti Sinha', email: 'sinha.riti@gmail.com'
            }, {
              name: 'Asmita Agarwal', email: 'asmitaagarwal4@gmail.com'
            }, {
              name: 'Yadubir Jha', email: 'yadubir12@gmail.com'
            }, {
              name: 'Anshuman Singh', email: 'anshumansingh7333@gmail.com'
            }].map((m, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">{m.name}</p>
                <p className="text-sm text-blue-600">{m.email}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Help;
