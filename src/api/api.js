const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('internify-user'));
  const token = user?.token;

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  // Auth
  login: (body) => fetch(`${VITE_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  signupSendOtp: (body) => fetch(`${VITE_API_BASE_URL}/auth/signup/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  signupVerifyOtp: (body) => fetch(`${VITE_API_BASE_URL}/auth/signup/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  
  // Applications
  fetchApplications: () => fetch(`${VITE_API_BASE_URL}/applications`, {
    headers: getAuthHeaders(),
  }),
  createApplication: (body) => fetch(`${VITE_API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  }),
  updateApplication: (id, body) => fetch(`${VITE_API_BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  }),
  uploadResume: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const user = JSON.parse(localStorage.getItem('internify-user'));

    return fetch(`${VITE_API_BASE_URL}/applications/${id}/upload-resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });
  },

  // Notes
  fetchNotes: (appId) => fetch(`${VITE_API_BASE_URL}/notes/${appId}`, {
    headers: getAuthHeaders(),
  }),
  addNote: (appId, note) => fetch(`${VITE_API_BASE_URL}/notes/${appId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  }),

  // Analytics
  fetchAnalytics: () => fetch(`${VITE_API_BASE_URL}/analytics/summary`, {
    headers: getAuthHeaders(),
  }),

  // AI-Powered Interview Tools
  generateQuestions: (appId, jobDescription) => fetch(`${VITE_API_BASE_URL}/applications/${appId}/generate-questions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ jobDescription }),
  }),
  startMockInterview: (appId) => fetch(`${VITE_API_BASE_URL}/mock-interview/start-session/${appId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  }),
  evaluateAnswer: (appId, question, userAnswer) => fetch(`${VITE_API_BASE_URL}/mock-interview/evaluate-answer`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ applicationId: appId, question, userAnswer }),
  }),
  processGradesheet: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return fetch('https://gpa-horizon-e194652d5a29.herokuapp.com/process-gradesheet/', {
      method: 'POST',
      body: formData,
    });
  },

  // Profile Management
  fetchProfile: () => fetch(`${VITE_API_BASE_URL}/profile`, {
    headers: getAuthHeaders(),
  }),
  updateProfile: (profileData) => fetch(`${VITE_API_BASE_URL}/profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  }),
};