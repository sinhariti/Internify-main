import React, { useState } from 'react';
import { BarChart3, Settings } from 'lucide-react';
import CardNav from './CardNav';
import StatsCards from './StatsCards';
import ApplicationsList from './ApplicationsList';
import Modals from './Modals';
import ProfilePage from './ProfilePage';
import { Loader } from '../pages/Internify';
import SideNav from './SideNav';

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
  handleNavigation,
  currentView,
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
  const [isNavOpen, setIsNavOpen] = useState(false); // retained state in case other parts rely on it later

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {(loading || notesLoading) && <Loader />}
      
      {/* <SideNav user={user} handleLogout={handleLogout} handleNavigation={handleNavigation} /> */}

      <CardNav 
        user={user} 
        handleLogout={handleLogout} 
        handleNavigation={handleNavigation} 
      />
      
      {currentView === 'profile' ? (
        <div style={{ paddingTop: '7rem' }}>
          <ProfilePage user={user} handleNavigation={handleNavigation} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-0 sm:ml-0" style={{ paddingTop: '7rem' }}>
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
      )}
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