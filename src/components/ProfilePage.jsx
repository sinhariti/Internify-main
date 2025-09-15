import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Plus,
  Trash2,
  X,
  Copy,
  Linkedin,
  Github,
  Link,
  User,
  Book
} from 'lucide-react';
import { api } from '../api/api';

const defaultProfileData = {
  urls: [
    { type: 'LinkedIn', url: '' },
    { type: 'Github', url: '' },
    { type: 'Leetcode', url: '' },
    { type: 'Codechef', url: '' },
    { type: 'Codeforces', url: '' }
  ],
  skills: [],
  workExperiences: [],
  projects: [],
  achievements: [],
  resumeLinks: [],
};

const ProfilePage = ({ user, handleNavigation }) => {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    collegeName: '',
    degree: '',
    branch: '',
    ...defaultProfileData
  });

  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [otherUrlType, setOtherUrlType] = useState('');

  // Helper function to ensure values are never null
  const ensureString = (value) => value || '';
  const ensureArray = (value) => Array.isArray(value) ? value : [];

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Copied to clipboard!');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await api.fetchProfile();
        if (response.ok) {
          const data = await response.json();
          
          // Safely parse profile data and ensure no null values
          const safeParsedData = (() => {
            try {
              return JSON.parse(data.profileDataJson || '{}');
            } catch {
              return {};
            }
          })();
          
          // Helper function to ensure string values are never null
          const ensureString = (value) => value || '';
          const ensureArray = (value) => Array.isArray(value) ? value : [];
          
          setProfile(prev => ({
            name: ensureString(user?.name),
            email: ensureString(user?.email),
            collegeName: ensureString(data.collegeName || safeParsedData.collegeName),
            degree: ensureString(data.degree || safeParsedData.degree),
            branch: ensureString(data.branch || safeParsedData.branch),
            urls: ensureArray(safeParsedData.urls || prev.urls).map(url => ({
              type: ensureString(url?.type),
              url: ensureString(url?.url)
            })),
            skills: ensureArray(safeParsedData.skills || prev.skills),
            workExperiences: ensureArray(safeParsedData.workExperiences || prev.workExperiences).map(exp => ({
              companyName: ensureString(exp?.companyName),
              position: ensureString(exp?.position),
              duration: ensureString(exp?.duration),
              description: ensureString(exp?.description)
            })),
            projects: ensureArray(safeParsedData.projects || prev.projects).map(proj => ({
              projectName: ensureString(proj?.projectName),
              projectUrl: ensureString(proj?.projectUrl),
              description: ensureString(proj?.description)
            })),
            achievements: ensureArray(safeParsedData.achievements || prev.achievements).map(ensureString),
            resumeLinks: ensureArray(safeParsedData.resumeLinks || prev.resumeLinks).map(ensureString)
          }));
        } else {
          toast.info('No profile found. You can create one now.');
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { name, email, collegeName, degree, branch, ...dynamicData } = profile;

      const payload = {
        collegeName,
        degree,
        branch,
        profileDataJson: JSON.stringify(dynamicData),
      };

      const response = await api.createOrUpdateProfile(payload);
      if (response.ok) {
        toast.success('Profile saved successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save profile.');
      }
    } catch (err) {
      toast.error('Network error. Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const skill = value.slice(0, -1).trim();
      if (skill && !profile.skills.includes(skill)) {
        setProfile(prev => ({
          ...prev,
          skills: [...prev.skills, skill]
        }));
        setNewSkill('');
      }
    } else {
      setNewSkill(value);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddLink = (field) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], { type: otherUrlType || `Other Link ${prev[field].length + 1}`, url: '' }]
    }));
    setOtherUrlType('');
  };

  const handleRemoveLink = (field, index) => {
    const newLinks = [...profile[field]];
    newLinks.splice(index, 1);
    setProfile(prev => ({ ...prev, [field]: newLinks }));
  };

  const handleLinkChange = (field, index, value) => {
    const newLinks = [...profile[field]];
    if (typeof newLinks[index] === 'string') {
        newLinks[index] = value;
    } else {
        newLinks[index].url = value;
    }
    setProfile(prev => ({ ...prev, [field]: newLinks }));
  };
  
  const handleAddWorkExperience = () => {
    setProfile(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, { companyName: '', position: '', duration: '', description: '' }]
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperiences = [...profile.workExperiences];
    newWorkExperiences[index][field] = value;
    setProfile(prev => ({ ...prev, workExperiences: newWorkExperiences }));
  };

  const handleRemoveWorkExperience = (index) => {
    const newWorkExperiences = [...profile.workExperiences];
    newWorkExperiences.splice(index, 1);
    setProfile(prev => ({ ...prev, workExperiences: newWorkExperiences }));
  };

  const handleAddProject = () => {
    setProfile(prev => ({ ...prev, projects: [...prev.projects, { projectName: '', projectUrl: '', description: '' }] }));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...profile.projects];
    newProjects[index][field] = value;
    setProfile(prev => ({ ...prev, projects: newProjects }));
  };
  
  const handleRemoveProject = (index) => {
    const newProjects = [...profile.projects];
    newProjects.splice(index, 1);
    setProfile(prev => ({ ...prev, projects: newProjects }));
  };

  const getUrlIcon = (linkType) => {
    switch (linkType) {
      case 'LinkedIn': return <Linkedin className="w-5 h-5" />;
      case 'Github': return <Github className="w-5 h-5" />;
      default: return <Link className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500 mt-1">Manage and update your personal information.</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={ensureString(profile.name)}
                  disabled
                  className="p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={ensureString(profile.email)}
                  disabled
                  className="p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">College Name</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Indian Institute of Technology Delhi')}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={ensureString(profile.collegeName)}
                  onChange={(e) => setProfile(prev => ({ ...prev, collegeName: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Indian Institute of Technology Delhi"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Degree</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Bachelor of Technology')}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={ensureString(profile.degree)}
                  onChange={(e) => setProfile(prev => ({ ...prev, degree: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bachelor of Technology"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Branch</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Computer Science Engineering')}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={ensureString(profile.branch)}
                  onChange={(e) => setProfile(prev => ({ ...prev, branch: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science Engineering"
                />
              </div>
            </div>
          </div>

          {/* Social & Resume Links */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Links</h2>
            <div className="space-y-4">
              {['LinkedIn', 'Github', 'Leetcode', 'Codechef', 'Codeforces'].map((linkType) => {
                const placeholderUrls = {
                  'LinkedIn': 'https://www.linkedin.com/in/your-username',
                  'Github': 'https://github.com/your-username',
                  'Leetcode': 'https://leetcode.com/your-username',
                  'Codechef': 'https://www.codechef.com/users/your-username',
                  'Codeforces': 'https://codeforces.com/profile/your-username'
                };
                const placeholderText = placeholderUrls[linkType];
                
                return (
                  <div key={linkType} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{getUrlIcon(linkType)}</span>
                        <label className="text-sm font-medium text-gray-700">{linkType}</label>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(placeholderText)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <input
                      type="url"
                      value={profile.urls.find(link => link.type === linkType)?.url || ''}
                      onChange={(e) => {
                        const newUrls = [...profile.urls];
                        const linkIndex = newUrls.findIndex(link => link.type === linkType);
                        if (linkIndex > -1) {
                          newUrls[linkIndex].url = e.target.value;
                        } else {
                          newUrls.push({ type: linkType, url: e.target.value });
                        }
                        setProfile(prev => ({ ...prev, urls: newUrls }));
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={placeholderText}
                    />
                  </div>
                );
              })}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Other Links</label>
                {profile.urls.filter(u => !['LinkedIn', 'Github', 'Leetcode', 'Codechef', 'Codeforces'].includes(u.type)).map((link, index) => (
                    <div key={`other-${index}`} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={ensureString(link.type)}
                            onChange={(e) => {
                                const newUrls = [...profile.urls];
                                newUrls.find(u => u.url === link.url).type = e.target.value;
                                setProfile(prev => ({ ...prev, urls: newUrls }));
                            }}
                            placeholder="Link Name (e.g., Personal Website)"
                            className="w-1/3 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="url"
                            value={ensureString(link.url)}
                            onChange={(e) => {
                                const newUrls = [...profile.urls];
                                newUrls.find(u => u.type === link.type).url = e.target.value;
                                setProfile(prev => ({ ...prev, urls: newUrls }));
                            }}
                            placeholder="https://"
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const newUrls = profile.urls.filter(u => u.url !== link.url);
                                setProfile(prev => ({ ...prev, urls: newUrls }));
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => handleAddLink('urls', 'Other')}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Other Link</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium text-gray-700 flex-1">Resume Drive Links</h4>
                <button
                  type="button"
                  onClick={() => handleAddLink('resumeLinks')}
                  className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Link</span>
                </button>
              </div>
              {profile.resumeLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={ensureString(link)}
                    onChange={(e) => handleLinkChange('resumeLinks', index, e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink('resumeLinks', index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map(skill => (
                <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-blue-500 hover:text-blue-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={newSkill}
                onChange={handleSkillsChange}
                placeholder="Type skill and press comma (e.g., React,)"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => {
                  const skill = newSkill.trim();
                  if (skill && !profile.skills.includes(skill)) {
                    setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
                    setNewSkill('');
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Work Experience</h2>
            <div className="space-y-6">
              {profile.workExperiences.map((exp, index) => (
                <div key={index} className="space-y-2 border-b pb-4 last:border-b-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={ensureString(exp.companyName)}
                        onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                        onDoubleClick={() => handleInputDoubleClick(`work-company-${index}`, 'Google Inc.', exp.companyName, (val) => handleWorkExperienceChange(index, 'companyName', val))}
                        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="e.g., Google Inc."
                      />
                      {!exp.companyName && (
                        <div 
                          className="absolute inset-0 flex items-center px-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handlePlaceholderClick('Google Inc.')}
                          title="Click to copy"
                        >
                          e.g., Google Inc.
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={ensureString(exp.position)}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        onDoubleClick={() => handleInputDoubleClick(`work-position-${index}`, 'Software Development Intern', exp.position, (val) => handleWorkExperienceChange(index, 'position', val))}
                        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="e.g., Software Development Intern"
                      />
                      {!exp.position && (
                        <div 
                          className="absolute inset-0 flex items-center px-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handlePlaceholderClick('Software Development Intern')}
                          title="Click to copy"
                        >
                          e.g., Software Development Intern
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={ensureString(exp.duration)}
                        onChange={(e) => handleWorkExperienceChange(index, 'duration', e.target.value)}
                        onDoubleClick={() => handleInputDoubleClick(`work-duration-${index}`, 'Jun 2023 - Aug 2023', exp.duration, (val) => handleWorkExperienceChange(index, 'duration', val))}
                        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="e.g., Jun 2023 - Aug 2023"
                      />
                      {!exp.duration && (
                        <div 
                          className="absolute inset-0 flex items-center px-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handlePlaceholderClick('Jun 2023 - Aug 2023')}
                          title="Click to copy"
                        >
                          e.g., Jun 2023 - Aug 2023
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      rows="3"
                      value={ensureString(exp.description)}
                      onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                      onDoubleClick={() => handleInputDoubleClick(`work-desc-${index}`, 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.', exp.description, (val) => handleWorkExperienceChange(index, 'description', val))}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Developed and maintained web applications using React and Node.js..."
                    />
                    {!exp.description && (
                      <div 
                        className="absolute top-3 left-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded p-1 pointer-events-none"
                        onClick={() => handlePlaceholderClick('Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.')}
                      >
                        Click to copy
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => handleRemoveWorkExperience(index)} className="text-red-600 text-sm">
                    Remove Experience
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddWorkExperience}
              className="mt-4 flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Experience</span>
            </button>
          </div>

          {/* Projects, Achievements, Certs */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Projects, Achievements & Certifications</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Projects</label>
                {profile.projects.map((proj, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={ensureString(proj.projectName)}
                        onChange={(e) => {
                          const newProjects = [...profile.projects];
                          newProjects[index].projectName = e.target.value;
                          setProfile(prev => ({ ...prev, projects: newProjects }));
                        }}
                        onDoubleClick={() => handleInputDoubleClick(`project-name-${index}`, 'E-commerce Website', proj.projectName, (val) => {
                          const newProjects = [...profile.projects];
                          newProjects[index].projectName = val;
                          setProfile(prev => ({ ...prev, projects: newProjects }));
                        })}
                        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="e.g., E-commerce Website"
                      />
                      {!proj.projectName && (
                        <div 
                          className="absolute inset-0 flex items-center px-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handlePlaceholderClick('E-commerce Website')}
                          title="Click to copy"
                        >
                          e.g., E-commerce Website
                        </div>
                      )}
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={ensureString(proj.projectUrl)}
                        onChange={(e) => {
                          const newProjects = [...profile.projects];
                          newProjects[index].projectUrl = e.target.value;
                          setProfile(prev => ({ ...prev, projects: newProjects }));
                        }}
                        onDoubleClick={() => handleInputDoubleClick(`project-url-${index}`, 'https://github.com/username/ecommerce-project', proj.projectUrl, (val) => {
                          const newProjects = [...profile.projects];
                          newProjects[index].projectUrl = val;
                          setProfile(prev => ({ ...prev, projects: newProjects }));
                        })}
                        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="e.g., https://github.com/username/project"
                      />
                      {!proj.projectUrl && (
                        <div 
                          className="absolute inset-0 flex items-center px-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handlePlaceholderClick('https://github.com/username/ecommerce-project')}
                          title="Click to copy"
                        >
                          e.g., https://github.com/username/project
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => handleRemoveProject(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Achievements and Certifications</label>
                {profile.achievements.map((ach, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={ensureString(ach)}
                        onChange={(e) => {
                          const newAchievements = [...profile.achievements];
                          newAchievements[index] = e.target.value;
                          setProfile(prev => ({ ...prev, achievements: newAchievements }));
                        }}
                        onDoubleClick={() => handleInputDoubleClick(`achievement-${index}`, 'AWS Certified Developer Associate', ach, (val) => {
                          const newAchievements = [...profile.achievements];
                          newAchievements[index] = val;
                          setProfile(prev => ({ ...prev, achievements: newAchievements }));
                        })}
                        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="e.g., AWS Certified Developer Associate"
                      />
                      {!ach && (
                        <div 
                          className="absolute inset-0 flex items-center px-3 text-gray-400 cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handlePlaceholderClick('AWS Certified Developer Associate')}
                          title="Click to copy"
                        >
                          e.g., AWS Certified Developer Associate
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => handleRemoveLink('achievements', index)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddLink('achievements', 'achievement')}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Achievement</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;