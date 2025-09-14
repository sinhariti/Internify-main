import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from '../components/Auth';
import Dashboard from '../components/Dashboard';
import { api } from '../api/api';

export const Loader = () => (
  <div className="fixed top-6 right-6 z-50 flex items-center justify-center">
    <div className="flex flex-col items-center bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-4 border border-blue-100">
      <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="text-blue-700 font-semibold text-base">Loading...</span>
    </div>
  </div>
);

const Internify = ({ initialView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState(initialView || 'login');
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState({});
  const [editingAppId, setEditingAppId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [appForm, setAppForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: '',
    deadline: '',
    jobLink: ''
  });
  const [newNote, setNewNote] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('internify-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // If user is logged in and on login/signup pages, redirect to dashboard
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/dashboard', { replace: true });
        setCurrentView('dashboard');
      } else {
        // Set view based on current route
        const routeToView = {
          '/dashboard': 'dashboard',
          '/profile': 'profile'
        };
        setCurrentView(routeToView[location.pathname] || 'dashboard');
      }
    } else {
      // No user, ensure we're on login or signup
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true });
        setCurrentView('login');
      }
    }
  }, [location.pathname, navigate]);

  const onAuthSuccess = (data, isLogin) => {
    const userData = { ...data, token: data.token };
    setUser(userData);
    localStorage.setItem('internify-user', JSON.stringify(userData));
    setCurrentView('dashboard');
    navigate('/dashboard', { replace: true });
    setTimeout(() => {
      toast.success(isLogin ? 'Login successful!' : 'Signup successful!');
    }, 100);
  };

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.fetchApplications();
      if (response.ok) {
        const data = await response.json();
        const applicationsArray = Array.isArray(data) ? data : (data.applications || []);
        setApplications(applicationsArray);
      } else {
        console.error('Failed to fetch applications:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.fetchAnalytics();
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async () => {
    setLoading(true);
    try {
      const response = await api.createApplication(appForm);
      if (response.ok) {
        const createdApp = await response.json();
        setShowAddModal(false);
        setAppForm({
          company: '',
          role: '',
          status: 'Applied',
          appliedDate: '',
          deadline: '',
          jobLink: ''
        });
        if (resumeFile && createdApp.id) {
          await uploadResume(createdApp.id, resumeFile);
          setResumeFile(null);
        }
        fetchApplications();
      } else {
        const errorText = await response.text();
        console.error("Create application failed:", errorText);
        toast.error('Failed to create application.');
      }
    } catch (err) {
      setError('Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (appId) => {
    if (!newNote.trim()) return;
    setNotesLoading(true);
    try {
      const response = await api.addNote(appId, newNote.trim());
      if (response.ok) {
        setNewNote('');
        await fetchNotes(appId);
      } else {
        console.error('Failed to add note:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  const fetchNotes = async (appId) => {
    setNotesLoading(true);
    try {
      const response = await api.fetchNotes(appId);
      if (response.ok) {
        const text = await response.text();
        if (!text.trim()) {
          setNotes(prev => ({ ...prev, [appId]: [] }));
          return;
        }
        try {
          const data = JSON.parse(text);
          let notesArray = [];
          if (Array.isArray(data)) {
            notesArray = data;
          } else if (data.notes && Array.isArray(data.notes)) {
            notesArray = data.notes;
          } else if (typeof data === 'string') {
            notesArray = [{ content: data, createdAt: new Date().toISOString() }];
          }
          setNotes(prev => ({ ...prev, [appId]: notesArray }));
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          setNotes(prev => ({ ...prev, [appId]: [] }));
        }
      } else {
        console.error('Failed to fetch notes:', response.status, response.statusText);
        setNotes(prev => ({ ...prev, [appId]: [] }));
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setNotes(prev => ({ ...prev, [appId]: [] }));
    } finally {
      setNotesLoading(false);
    }
  };

  const uploadResume = async (appId, file) => {
    setLoading(true);
    try {
      const response = await api.uploadResume(appId, file);
      if (response.ok) {
        console.log("Resume uploaded successfully!");
        fetchApplications();
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (id) => {
    setLoading(true);
    try {
      const res = await api.updateApplication(id, editForm);
      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? updated : a))
        );
        setEditingAppId(null);
      } else {
        console.error("Failed to update application");
      }
    } catch (err) {
      console.error("Error updating:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAppForm({
      company: '', role: '', status: 'Applied', appliedDate: '', deadline: '', jobLink: ''
    });
    localStorage.clear();
    setUser(null);
    setCurrentView('login');
    navigate('/login', { replace: true });
    setApplications([]);
    setAnalytics(null);
    setNotes({});
    setTimeout(() => {
      toast.info('Logged out successfully!');
    }, 200);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === 'profile') {
      navigate('/profile');
    } else if (view === 'dashboard') {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (user && currentView === 'dashboard') {
      fetchApplications();
      fetchAnalytics();
    }
  }, [user, currentView]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         app.status === filterStatus ||
                         app.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      {(currentView === 'dashboard' || currentView === 'profile') && user ? (
        <Dashboard
          user={user}
          loading={loading}
          notesLoading={notesLoading}
          applications={applications}
          analytics={analytics}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          handleLogout={handleLogout}
          handleNavigation={handleNavigation}
          currentView={currentView}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          appForm={appForm}
          setAppForm={setAppForm}
          createApplication={createApplication}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          selectedApp={selectedApp}
          setSelectedApp={setSelectedApp}
          notes={notes}
          newNote={newNote}
          setNewNote={setNewNote}
          addNote={addNote}
          editingAppId={editingAppId}
          setEditingAppId={setEditingAppId}
          editForm={editForm}
          setEditForm={setEditForm}
          saveEdit={saveEdit}
          fetchNotes={fetchNotes}
          uploadResume={uploadResume}
          filteredApplications={filteredApplications}
        />
      ) : (
        <Auth
          currentView={currentView}
          setCurrentView={setCurrentView}
          onAuthSuccess={onAuthSuccess}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default Internify;