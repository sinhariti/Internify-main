import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Building2,
  Calendar,
  AlertCircle,
  ExternalLink,
  StickyNote,
  Upload,
  Clock,
  Check,
  X,
  Briefcase,
  MessageSquareText // Added new icon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../api/api';

// New component imports
import QuestionsModal from './QuestionsModal';

const ApplicationsList = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  setShowAddModal,
  filteredApplications,
  setSelectedApp,
  fetchNotes,
  uploadResume,
  editingAppId,
  setEditingAppId,
  editForm,
  setEditForm,
  saveEdit
}) => {
  const [generatedQuestions, setGeneratedQuestions] = useState('');
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [selectedApplicationForQuestions, setSelectedApplicationForQuestions] = useState(null);

  const handleGenerateQuestions = async (appId, jobDescription) => {
    setQuestionsLoading(true);
    try {
      const response = await api.generateQuestions(appId, jobDescription);
      const data = await response.json();

      if (response.ok) {
        setGeneratedQuestions(data.questions);
      } else {
        toast.error(data.message || 'Failed to generate questions. Please try again.');
        setGeneratedQuestions('Failed to generate questions. Please check the job description and your resume.');
      }
    } catch (err) {
      toast.error('Network error. Failed to generate questions.');
      setGeneratedQuestions('Network error. Failed to generate questions.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <Clock className="w-4 h-4" />;
      case 'Interview': return <AlertCircle className="w-4 h-4" />;
      case 'Accepted': return <Check className="w-4 h-4" />;
      case 'Rejected': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((app, index) => (
          <div
            key={app.id || index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  {editingAppId === app.id ? (
                    <>
                      <input
                        type="text"
                        value={editForm.company || ''}
                        onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))}
                        className="font-bold text-gray-900 border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-gray-50 px-1"
                      />
                      <input
                        type="text"
                        value={editForm.role || ''}
                        onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                        className="text-sm text-gray-500 border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-gray-50 px-1 mt-1"
                      />
                      <select
                        value={editForm.status || 'Applied'}
                        onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                        className="text-xs border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-gray-50 px-1 mt-1"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-gray-900">{app.company || 'Unknown Company'}</h3>
                      <p className="text-sm text-gray-500">{app.role || 'Unknown Role'}</p>
                    </>
                  )}
                </div>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status || 'Applied')}`}>
                {getStatusIcon(app.status || 'Applied')}
                <span>{editingAppId === app.id ? (editForm.status || 'Applied') : (app.status || 'Applied')}</span>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {editingAppId === app.id ? (
                <>
                  <input
                    type="date"
                    value={editForm.appliedDate || ''}
                    onChange={e => setEditForm(f => ({ ...f, appliedDate: e.target.value }))}
                    className="text-sm text-gray-500 border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-gray-50 px-1"
                  />
                  <input
                    type="date"
                    value={editForm.deadline || ''}
                    onChange={e => setEditForm(f => ({ ...f, deadline: e.target.value }))}
                    className="text-sm text-gray-500 border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-gray-50 px-1 mt-1"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Applied: {app.applied_date || app.appliedDate || 'N/A'}</span>
                  </div>
                  {app.deadline && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>Deadline: {app.deadline}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {(app.job_link || app.jobLink) && (
                  editingAppId === app.id ? (
                    <input
                      type="url"
                      value={editForm.jobLink || ''}
                      onChange={e => setEditForm(f => ({ ...f, jobLink: e.target.value }))}
                      className="text-xs border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-gray-50 px-1"
                    />
                  ) : (
                    <a
                      href={app.job_link || app.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )
                )}
                <button
                  onClick={() => {
                    setSelectedApp(app);
                    fetchNotes(app.id || index);
                  }}
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                >
                  <StickyNote className="w-4 h-4" />
                </button>
                {/* New button for interview questions */}
                <button
                  onClick={() => {
                    setSelectedApplicationForQuestions(app);
                    setJobDescriptionInput(app.jobDescription || '');
                    setGeneratedQuestions('');
                    setShowQuestionsModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  <MessageSquareText className="w-4 h-4" />
                </button>
              </div>
              {app.resumeUrl ? (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  📄 View Resume
                </a>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) uploadResume(app.id || index, file);
                    }}
                  />
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-300 pointer-events-none">
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex space-x-1 ml-2">
                {editingAppId === app.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(app.id)}
                      className="text-green-600 hover:underline text-xs px-2 py-1 rounded"
                    >Save</button>
                    <button
                      onClick={() => setEditingAppId(null)}
                      className="text-gray-400 hover:underline text-xs px-2 py-1 rounded"
                    >Cancel</button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingAppId(app.id);
                      setEditForm({
                        company: app.company,
                        role: app.role,
                        status: app.status,
                        appliedDate: app.applied_date || app.appliedDate || '',
                        deadline: app.deadline || '',
                        jobLink: app.job_link || app.jobLink || ''
                      });
                    }}
                    className="text-blue-600 hover:underline text-xs px-2 py-1 rounded"
                  >Edit</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500 mb-4">Start tracking your internship applications</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Add Your First Application
          </button>
        </div>
      )}

      {/* Questions Modal */}
      {showQuestionsModal && selectedApplicationForQuestions && (
        <QuestionsModal
          onClose={() => setShowQuestionsModal(false)}
          onGenerate={handleGenerateQuestions}
          questionsLoading={questionsLoading}
          generatedQuestions={generatedQuestions}
          setGeneratedQuestions={setGeneratedQuestions}
          jobDescriptionInput={jobDescriptionInput}
          setJobDescriptionInput={setJobDescriptionInput}
          appId={selectedApplicationForQuestions.id}
        />
      )}
    </>
  );
};

export default ApplicationsList;