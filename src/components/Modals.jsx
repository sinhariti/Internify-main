import React from 'react';
import { X, Plus, Clock, Check, AlertCircle, Briefcase, Calendar, Upload } from 'lucide-react';

const Modals = ({
  showAddModal,
  setShowAddModal,
  appForm,
  setAppForm,
  createApplication,
  resumeFile,
  setResumeFile,
  selectedApp,
  setSelectedApp,
  notes,
  newNote,
  setNewNote,
  addNote,
  loading,
  notesLoading
}) => {
  return (
    <>
      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform animate-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Application</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                value={appForm.company}
                onChange={(e) => setAppForm(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Role/Position"
                value={appForm.role}
                onChange={(e) => setAppForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <select
                value={appForm.status}
                onChange={(e) => setAppForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="date"
                placeholder="Applied Date"
                value={appForm.appliedDate}
                onChange={(e) => setAppForm(prev => ({ ...prev, appliedDate: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <input
                type="date"
                placeholder="Deadline"
                value={appForm.deadline}
                onChange={(e) => setAppForm(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <input
                type="url"
                placeholder="Job Link"
                value={appForm.jobLink}
                onChange={(e) => setAppForm(prev => ({ ...prev, jobLink: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setResumeFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {resumeFile && (
                  <div className="text-xs text-gray-500 mt-1">Selected: {resumeFile.name}</div>
                )}
              </div>
              <button
                onClick={createApplication}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg transform">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Notes - {selectedApp.company}</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
              {notes[selectedApp.id]?.length > 0 ? (
                notes[selectedApp.id].map((note, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{note.content || note}</p>
                    <p className="text-xs text-gray-500 mt-1">{note.createdAt || 'Just now'}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && addNote(selectedApp.id)}
              />
              <button
                onClick={() => addNote(selectedApp.id)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;