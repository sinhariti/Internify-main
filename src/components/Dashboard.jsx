import React, { useState } from 'react';
import { Menu, X, Home, FileText, BarChart3, Settings, HelpCircle, LogOut, User } from 'lucide-react';
import Header from './Header';
import StatsCards from './StatsCards';
import ApplicationsList from './ApplicationsList';
import Modals from './Modals';
import { Loader } from '../pages/Internify';

const Dashboard = ({
  user,
  loading,
  notesLoading,
  applications,
  analytics,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  handleLogout,
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
  editingAppId,
  setEditingAppId,
  editForm,
  setEditForm,
  saveEdit,
  fetchNotes,
  uploadResume,
  filteredApplications
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', action: () => console.log('Dashboard clicked') },
    { icon: FileText, label: 'Applications', action: () => console.log('Applications clicked') },
    { icon: BarChart3, label: 'Analytics', action: () => console.log('Analytics clicked') },
    { icon: User, label: 'Profile', action: () => console.log('Profile clicked') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings clicked') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help clicked') },
    { icon: LogOut, label: 'Logout', action: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {(loading || notesLoading) && <Loader />}
      
      {/* Navigation Toggle Button */}
      <button
        onClick={() => setIsNavOpen(true)}
        className="fixed top-3 left-4 z-40 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Side Navigation Modal */}
      {isNavOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setIsNavOpen(false)}
          />
          
          {/* Navigation Panel */}
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-lg p-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Internify</h2>
                  <p className="text-blue-100 text-sm">Welcome, {user?.name || 'User'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsNavOpen(false)}
                className="p-2 text-white hover:bg-purple-500 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="py-6">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                const isLogout = item.label === 'Logout';
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsNavOpen(false);
                    }}
                    className={`w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 ${
                      isLogout ? 'border-t border-gray-200 mt-4 text-red-600 hover:bg-red-50' : 'text-gray-700'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isLogout ? 'text-red-500' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-center text-sm text-gray-500">
                <p>Internify Dashboard</p>
                <p className="text-xs mt-1">Track your internship journey</p>
              </div>
            </div>
          </div>
        </>
      )}

      <Header user={user} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-0 sm:ml-0">
        <StatsCards applications={applications} />
        <ApplicationsList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setShowAddModal={setShowAddModal}
          filteredApplications={filteredApplications}
          setSelectedApp={setSelectedApp}
          fetchNotes={fetchNotes}
          uploadResume={uploadResume}
          editingAppId={editingAppId}
          setEditingAppId={setEditingAppId}
          editForm={editForm}
          setEditForm={setEditForm}
          saveEdit={saveEdit}
        />
      </div>
      <Modals
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
        loading={loading}
        notesLoading={notesLoading}
      />
    </div>
  );
};

export default Dashboard;





// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Plus, UploadCloud, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const Dashboard = () => {
//   const [applications, setApplications] = useState([]);
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     const jwt = localStorage.getItem('token');
//     setToken(jwt);
//     fetchApplications(jwt);
//   }, []);

//   const fetchApplications = async (jwt) => {
//     try {
//       const res = await fetch('http://localhost:8080/api/applications', {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       });
//       const data = await res.json();
//       console.log(data);
//       setApplications(data);
//     } catch (err) {
//       console.error('Error fetching applications:', err);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="min-h-screen p-8 bg-[#C5E7E2]"
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-bold text-[#627264]">Your Applications</h1>
//         <div className="flex gap-4">
//           <Button className="bg-[#A1CDA8] text-[#627264] hover:bg-[#ABD6B9]">
//             <Plus className="mr-2" /> New
//           </Button>
//           <Button className="bg-[#AD9BAA] text-white hover:bg-[#B5DFCA]">
//             <LogOut className="mr-2" /> Logout
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {applications.map((app) => (
//           <motion.div
//             key={app.id}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white rounded-2xl p-6 shadow-xl transition-all border border-[#ABD6B9]"
//           >
//             <h2 className="text-xl font-semibold text-[#627264] mb-2">{app.role} @ {app.company}</h2>
//             <p className="text-sm text-[#627264] mb-1">Deadline: {app.deadline}</p>
//             <a
//               href={app.jobLink}
//               className="text-sm text-blue-600 underline"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               View Job
//             </a>
//             <div className="mt-4 flex justify-between items-center">
//               <Button className="bg-[#627264] text-white hover:bg-[#A1CDA8]">
//                 <UploadCloud className="mr-2" /> Upload Resume
//               </Button>
//               <span className="text-xs text-[#AD9BAA]">Status: {app.status}</span>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default Dashboard;