import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Award, 
  Code, 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  Camera,
  CheckCircle2
} from 'lucide-react';
import '../components/CustomAnimation.css';

const About = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('/profile.jpg');
  const [uploadingPic, setUploadingPic] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const [form, setForm] = useState({
    year: '',
    title: '',
    company: '',
    description: ''
  });

  // Fetch milestones from API
  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin profile details publicly (profile pic)
  const fetchAdminProfile = async () => {
    try {
      const res = await fetch('/api/auth/admin-profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchAdminProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePicUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    setUploadingPic(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await authFetch('/api/auth/profile-pic', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.profilePic) {
        setProfilePic(data.profilePic);
        alert('Profile picture updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploadingPic(false);
    }
  };

  const startAddMilestone = () => {
    setEditingMilestone(null);
    setForm({
      year: '',
      title: '',
      company: '',
      description: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const startEditMilestone = (ms) => {
    setEditingMilestone(ms);
    setForm({
      year: ms.year,
      title: ms.title,
      company: ms.company || '',
      description: ms.description
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.year || !form.title || !form.description) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const msId = editingMilestone ? (editingMilestone.id || editingMilestone._id) : '';
      const url = editingMilestone ? `/api/milestones/${msId}` : '/api/milestones';
      const method = editingMilestone ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save milestone');
      }

      setIsModalOpen(false);
      fetchMilestones();
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journey milestone?')) return;

    try {
      const res = await authFetch(`/api/milestones/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchMilestones();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete milestone');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About <span className="text-gradient">Me</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Learn about my software engineering journey, AWS cloud credentials, and technical vision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Profile Card & Highlights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl shadow-sm flex flex-col items-center text-center glow-border">
            <div className="relative group mb-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative w-48 h-56 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-md">
                <img
                  src={profilePic.startsWith('http') ? profilePic : `${import.meta.env.VITE_API_URL || ''}${profilePic}`}
                  alt="Don Bosco P"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
                
                {/* Admin Profile Pic Upload Overlay */}
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label className="cursor-pointer p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all flex flex-col items-center gap-1">
                      {uploadingPic ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Camera className="h-6 w-6" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                        disabled={uploadingPic}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Don Bosco P</h3>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-1">
              Full-Stack MERN Developer & AWS Cloud Trainee
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Building scalable web applications & cloud-ready infrastructure.
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4 border border-purple-500/20">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Continuous Learner</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Always mastering new technologies</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4 border border-pink-500/20">
              <div className="p-3 bg-pink-500/10 rounded-xl text-pink-600 dark:text-pink-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Detail-Oriented</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Committed to clean code & cloud-ready architecture</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Story & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Story Section */}
          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-white/10 space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <Code className="text-purple-600 dark:text-purple-400 mr-2 h-6 w-6" />
              My Professional Story
            </h3>
            
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Hello! My name is <strong>Don Bosco P</strong>, a final-year B.Tech Information Technology student at University College of Engineering, BIT Campus, Anna University in Tiruchirappalli. I am passionate about building real-world web applications and cloud-ready solutions.
              </p>
              <p>
                Over the past year, I have gained hands-on experience through web development internships at <strong className="text-purple-600 dark:text-purple-400 font-bold">iLINKS Infotech</strong> and <strong className="text-purple-600 dark:text-purple-400 font-bold">EdiGlobe</strong>, where I focused on responsive UI development, REST API integration, database engineering, and debugging. My primary stack includes <strong>MongoDB, Express.js, React.js, Node.js, JavaScript, and Java (OOP)</strong>.
              </p>
              <p>
                Recently, I expanded my expertise into cloud computing as an <strong className="text-purple-600 dark:text-purple-400 font-bold">AWS Cloud Trainee</strong> in the <strong className="text-purple-600 dark:text-purple-400 font-bold">AWS re/Start Program at Don Bosco Skill Mission (DBSM), Bangalore</strong>. I have earned the <strong>AWS Cloud Quest: Cloud Practitioner</strong> credential and hands-on experience provisioning AWS infrastructure (such as EBS GP3 volumes via AWS CLI), working with Linux environments, and exploring Agentic AI systems.
              </p>
              <p>
                I enjoy solving complex problems, writing clean code, and building scalable full-stack solutions. I am actively seeking entry-level opportunities as a <strong>Full-Stack Developer</strong>, <strong>Frontend Developer</strong>, or <strong>Software Engineer</strong> where I can contribute and make an impact.
              </p>
            </div>
          </div>

          {/* Timeline & Journey Section */}
          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-white/10 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200/40 dark:border-white/10 pb-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <Calendar className="text-purple-600 dark:text-purple-400 mr-2 h-6 w-6" />
                Timeline & Journey
              </h3>
              
              {/* Add Milestone Trigger for Admin */}
              {isAuthenticated && (
                <button
                  onClick={startAddMilestone}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Milestone
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : milestones.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-6">No milestones added yet.</p>
            ) : (
              <div className="relative border-l-2 border-purple-500/30 pl-6 space-y-8 ml-3">
                {milestones.map((item) => {
                  const msId = item.id || item._id;
                  return (
                    <div key={msId} className="relative group">
                      {/* Timeline point indicator */}
                      <span className="absolute -left-[31px] top-1.5 bg-purple-600 w-3.5 h-3.5 rounded-full border-4 border-slate-900 shadow-md"></span>
                      
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          {item.year}
                        </span>
                        
                        {/* Admin CRUD controls */}
                        {isAuthenticated && (
                          <div className="flex space-x-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditMilestone(item)}
                              className="p-1 text-purple-600 hover:bg-purple-500/10 rounded cursor-pointer"
                              title="Edit milestone"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(msId)}
                              className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                              title="Delete milestone"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h4>
                      {item.company && (
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.company}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-white/20">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Award className="text-purple-600 dark:text-purple-400 mr-2 h-5 w-5" />
              {editingMilestone ? 'Edit Journey Milestone' : 'Add Journey Milestone'}
            </h3>

            {formError && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Year / Period
                </label>
                <input
                  type="text"
                  name="year"
                  required
                  value={form.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  placeholder="e.g. August 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  placeholder="e.g. AI & Emerging Tech Insights"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Company / Event / Institution
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  placeholder="e.g. Microsoft Innovation Hub (Bengaluru)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  placeholder="Describe your achievements and activities..."
                />
              </div>

              <div className="flex gap-4 pt-4 justify-end border-t border-slate-200/40 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-400/40 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  {formSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="mr-1.5 h-4 w-4" /> Save Milestone
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
