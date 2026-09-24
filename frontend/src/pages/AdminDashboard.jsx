import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  MessageSquare,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FileDown,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Award,
  Briefcase,
  Code2,
  CheckCircle,
  ExternalLink,
  Upload
} from 'lucide-react';
import IconsaxIcon from '../components/IconsaxIcon';
import AnimeWrapper from '../components/AnimeWrapper';
import '../components/CustomAnimation.css';

const AdminDashboard = () => {
  const { authFetch } = useAuth();
  
  // Dashboard navigation tabs
  const [activeTab, setActiveTab] = useState('projects');
  
  // Stats
  const [stats, setStats] = useState({
    visitorCount: 0,
    projectCount: 0,
    skillCount: 0,
    certCount: 0,
    milestoneCount: 0,
    messageCount: 0
  });

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
    features: '',
    challengesFaced: '',
    learningOutcomes: '',
    category: 'Web',
    existingImages: []
  });
  const [selectedProjectFiles, setSelectedProjectFiles] = useState([]);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectError, setProjectError] = useState(null);

  // Skills State
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', level: 85, category: 'frontend', icon: 'code' });
  const [skillSubmitting, setSkillSubmitting] = useState(false);

  // Certifications State
  const [certifications, setCertifications] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({ title: '', issuer: '', date: '', credentialId: '', verifyUrl: '', category: 'practical', description: '' });
  const [certFile, setCertFile] = useState(null);
  const [certSubmitting, setCertSubmitting] = useState(false);

  // Milestones State
  const [milestones, setMilestones] = useState([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({ year: '', title: '', company: '', description: '', icon: 'briefcase' });
  const [milestoneSubmitting, setMilestoneSubmitting] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Fetch functions
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setStats(prev => ({ ...prev, projectCount: data.length }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
        setStats(prev => ({ ...prev, skillCount: data.length }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchCertifications = async () => {
    setLoadingCerts(true);
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) {
        const data = await res.json();
        setCertifications(data);
        setStats(prev => ({ ...prev, certCount: data.length }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCerts(false);
    }
  };

  const fetchMilestones = async () => {
    setLoadingMilestones(true);
    try {
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
        setStats(prev => ({ ...prev, milestoneCount: data.length }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMilestones(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await authFetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setStats(prev => ({ ...prev, messageCount: data.length }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchVisitorStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({ ...prev, visitorCount: data.count }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSkills();
    fetchCertifications();
    fetchMilestones();
    fetchMessages();
    fetchVisitorStats();
  }, []);

  // --- PROJECT HANDLERS ---
  const startAddProject = () => {
    setEditingProject(null);
    setProjectForm({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', features: '', challengesFaced: '', learningOutcomes: '', category: 'Web', existingImages: [] });
    setSelectedProjectFiles([]);
    setProjectError(null);
    setIsProjectModalOpen(true);
  };

  const startEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
      githubLink: proj.githubLink || proj.github_url || '',
      liveLink: proj.liveLink || proj.demo_url || '',
      features: Array.isArray(proj.features) ? proj.features.join(', ') : (proj.features || ''),
      challengesFaced: proj.challengesFaced || proj.challenges_faced || '',
      learningOutcomes: proj.learningOutcomes || proj.learning_outcomes || '',
      category: proj.category || 'Web',
      existingImages: proj.images || []
    });
    setSelectedProjectFiles([]);
    setProjectError(null);
    setIsProjectModalOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectSubmitting(true);
    setProjectError(null);

    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('technologies', projectForm.technologies);
    formData.append('githubLink', projectForm.githubLink);
    formData.append('liveLink', projectForm.liveLink);
    formData.append('features', projectForm.features);
    formData.append('challengesFaced', projectForm.challengesFaced);
    formData.append('learningOutcomes', projectForm.learningOutcomes);
    formData.append('category', projectForm.category);

    projectForm.existingImages.forEach(img => formData.append('existingImages', img));
    selectedProjectFiles.forEach(file => formData.append('images', file));

    try {
      const projId = editingProject ? (editingProject.id || editingProject._id) : '';
      const url = editingProject ? `/api/projects/${projId}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await authFetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save project');

      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      setProjectError(err.message);
    } finally {
      setProjectSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      const res = await authFetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- SKILL HANDLERS ---
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setSkillSubmitting(true);
    try {
      const skillId = editingSkill ? (editingSkill.id || editingSkill._id) : '';
      const url = editingSkill ? `/api/skills/${skillId}` : '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillForm)
      });
      if (res.ok) {
        setIsSkillModalOpen(false);
        fetchSkills();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSkillSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await authFetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSkills();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- CERTIFICATION HANDLERS ---
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    if (!certFile) {
      alert('Please select a certificate file (PDF or Image)');
      return;
    }
    setCertSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', certForm.title);
      formData.append('issuer', certForm.issuer);
      formData.append('date', certForm.date);
      formData.append('credentialId', certForm.credentialId);
      formData.append('verifyUrl', certForm.verifyUrl);
      formData.append('category', certForm.category);
      formData.append('description', certForm.description);
      formData.append('file', certFile);

      const res = await authFetch('/api/certifications', { method: 'POST', body: formData });
      if (res.ok) {
        setIsCertModalOpen(false);
        setCertFile(null);
        fetchCertifications();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add certification');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setCertSubmitting(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      const res = await authFetch(`/api/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCertifications();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- MILESTONE HANDLERS ---
  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    setMilestoneSubmitting(true);
    try {
      const msId = editingMilestone ? (editingMilestone.id || editingMilestone._id) : '';
      const url = editingMilestone ? `/api/milestones/${msId}` : '/api/milestones';
      const method = editingMilestone ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestoneForm)
      });
      if (res.ok) {
        setIsMilestoneModalOpen(false);
        fetchMilestones();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setMilestoneSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (!window.confirm('Delete this milestone?')) return;
    try {
      const res = await authFetch(`/api/milestones/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMilestones();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- MESSAGE HANDLERS ---
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete message?')) return;
    try {
      const res = await authFetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <AnimeWrapper animationType="fadeUp" delay={100}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              Admin Portal
            </span>
            <h1 className="fluid-heading-lg mt-2 text-slate-900 dark:text-white">
              Dynamic CMS Dashboard
            </h1>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap gap-3">
            <div className="glass-panel px-4 py-2 rounded-2xl flex items-center space-x-2 border border-purple-500/20">
              <FolderKanban className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-bold">{stats.projectCount} Projects</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-2xl flex items-center space-x-2 border border-pink-500/20">
              <Code2 className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-bold">{stats.skillCount} Skills</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-2xl flex items-center space-x-2 border border-emerald-500/20">
              <Award className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold">{stats.certCount} Certs</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-2xl flex items-center space-x-2 border border-indigo-500/20">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-bold">{stats.messageCount} Messages</span>
            </div>
          </div>
        </div>
      </AnimeWrapper>

      {/* Navigation Tabs */}
      <AnimeWrapper animationType="fadeUp" delay={150}>
        <div className="flex flex-wrap gap-2 mb-8 glass-panel p-2 rounded-2xl border border-slate-200/50 dark:border-white/10">
          {[
            { id: 'projects', label: 'Projects', icon: FolderKanban },
            { id: 'skills', label: 'Skills', icon: Code2 },
            { id: 'certs', label: 'Certifications', icon: Award },
            { id: 'milestones', label: 'Milestones', icon: Briefcase },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-purple-500/10'
                }`}
              >
                <IconComp className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </AnimeWrapper>

      {/* TAB 1: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <AnimeWrapper animationType="fadeUp" delay={200}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Projects</h2>
              <button
                onClick={startAddProject}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Project</span>
              </button>
            </div>

            {loadingProjects ? (
              <div className="py-12 text-center text-slate-500">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="py-12 text-center glass-panel rounded-3xl text-slate-500">No projects added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(proj => {
                  const projId = proj.id || proj._id;
                  return (
                    <div key={projId} className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{proj.category || 'Web'}</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{proj.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">{proj.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/40 dark:border-white/5">
                        <Link to={`/projects/${projId}`} className="text-xs font-bold text-purple-600 hover:underline">View Live</Link>
                        <div className="flex space-x-2">
                          <button onClick={() => startEditProject(proj)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-purple-500/10"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteProject(projId)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimeWrapper>
      )}

      {/* TAB 2: SKILLS MANAGEMENT */}
      {activeTab === 'skills' && (
        <AnimeWrapper animationType="fadeUp" delay={200}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Skills</h2>
              <button
                onClick={() => { setEditingSkill(null); setSkillForm({ name: '', level: 85, category: 'frontend', icon: 'code' }); setIsSkillModalOpen(true); }}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>

            {loadingSkills ? (
              <div className="py-12 text-center text-slate-500">Loading skills...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map(sk => {
                  const skId = sk.id || sk._id;
                  return (
                    <div key={skId} className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{sk.name}</h4>
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{sk.category} ({sk.level}%)</span>
                      </div>
                      <div className="flex space-x-1">
                        <button onClick={() => { setEditingSkill(sk); setSkillForm({ name: sk.name, level: sk.level, category: sk.category, icon: sk.icon || 'code' }); setIsSkillModalOpen(true); }} className="p-1 rounded-lg text-slate-400 hover:text-purple-500"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteSkill(skId)} className="p-1 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimeWrapper>
      )}

      {/* TAB 3: CERTIFICATIONS MANAGEMENT */}
      {activeTab === 'certs' && (
        <AnimeWrapper animationType="fadeUp" delay={200}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Certifications</h2>
              <button
                onClick={() => { setCertForm({ title: '', issuer: '', date: '', credentialId: '', verifyUrl: '', category: 'practical', description: '' }); setCertFile(null); setIsCertModalOpen(true); }}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Certificate</span>
              </button>
            </div>

            {loadingCerts ? (
              <div className="py-12 text-center text-slate-500">Loading certifications...</div>
            ) : certifications.length === 0 ? (
              <div className="py-12 text-center glass-panel rounded-3xl text-slate-500">No certifications added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map(cert => {
                  const certId = cert.id || cert._id;
                  return (
                    <div key={certId} className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-500">{cert.issuer}</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{cert.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{cert.date || cert.issue_date}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 dark:border-white/5">
                        {cert.pdf_url && <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-600 hover:underline">View PDF/Image</a>}
                        <button onClick={() => handleDeleteCert(certId)} className="p-1 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimeWrapper>
      )}

      {/* TAB 4: MILESTONES MANAGEMENT */}
      {activeTab === 'milestones' && (
        <AnimeWrapper animationType="fadeUp" delay={200}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Experience & Milestones</h2>
              <button
                onClick={() => { setEditingMilestone(null); setMilestoneForm({ year: '', title: '', company: '', description: '', icon: 'briefcase' }); setIsMilestoneModalOpen(true); }}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Milestone</span>
              </button>
            </div>

            {loadingMilestones ? (
              <div className="py-12 text-center text-slate-500">Loading milestones...</div>
            ) : milestones.length === 0 ? (
              <div className="py-12 text-center glass-panel rounded-3xl text-slate-500">No milestones added yet.</div>
            ) : (
              <div className="space-y-4">
                {milestones.map(ms => {
                  const msId = ms.id || ms._id;
                  return (
                    <div key={msId} className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{ms.year} • {ms.company}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{ms.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{ms.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditingMilestone(ms); setMilestoneForm({ year: ms.year, title: ms.title, company: ms.company || '', description: ms.description || '', icon: ms.icon || 'briefcase' }); setIsMilestoneModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-500"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteMilestone(msId)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimeWrapper>
      )}

      {/* TAB 5: MESSAGES */}
      {activeTab === 'messages' && (
        <AnimeWrapper animationType="fadeUp" delay={200}>
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Form Messages</h2>
            {loadingMessages ? (
              <div className="py-12 text-center text-slate-500">Loading inbox messages...</div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center glass-panel rounded-3xl text-slate-500">No contact messages received yet.</div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => {
                  const msgId = msg.id || msg._id;
                  return (
                    <div key={msgId} className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                          <span className="text-xs text-slate-400">&lt;{msg.email}&gt;</span>
                        </div>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{msg.subject || 'No Subject'}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{msg.message}</p>
                      </div>
                      <button onClick={() => handleDeleteMessage(msgId)} className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20">Delete</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimeWrapper>
      )}

      {/* TAB 6: ANALYTICS */}
      {activeTab === 'analytics' && (
        <AnimeWrapper animationType="fadeUp" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-3xl text-center space-y-2 border border-purple-500/20">
              <Eye className="h-8 w-8 text-purple-500 mx-auto" />
              <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{stats.visitorCount}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Unique Visitors</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl text-center space-y-2 border border-pink-500/20">
              <FolderKanban className="h-8 w-8 text-pink-500 mx-auto" />
              <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{stats.projectCount}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Portfolio Projects</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl text-center space-y-2 border border-emerald-500/20">
              <MessageSquare className="h-8 w-8 text-emerald-500 mx-auto" />
              <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{stats.messageCount}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Messages Received</p>
            </div>
          </div>
        </AnimeWrapper>
      )}

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/40 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            {projectError && <div className="mt-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">{projectError}</div>}

            <form onSubmit={handleProjectSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <textarea rows={3} required value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Technologies (comma separated)</label>
                  <input type="text" value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                  <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none">
                    <option value="Web">Web Application</option>
                    <option value="Mobile">Mobile App</option>
                    <option value="PostgreSQL">PostgreSQL / Cloud</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">GitHub Link</label>
                  <input type="url" value={projectForm.githubLink} onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Live Demo Link</label>
                  <input type="url" value={projectForm.liveLink} onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Key Features (comma separated)</label>
                <input type="text" value={projectForm.features} onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Upload Project Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setSelectedProjectFiles(Array.from(e.target.files))} className="w-full text-sm text-slate-400" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-400/40 text-slate-300">Cancel</button>
                <button type="submit" disabled={projectSubmitting} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold flex items-center space-x-2"><Save size={16} /><span>{projectSubmitting ? 'Saving...' : 'Save Project'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/40 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSkillSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Skill Name</label>
                <input type="text" required value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Proficiency Level ({skillForm.level}%)</label>
                <input type="range" min="10" max="100" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value, 10) })} className="w-full accent-purple-600" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database & Cloud</option>
                  <option value="devops">DevOps & Tools</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsSkillModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-400/40 text-slate-300">Cancel</button>
                <button type="submit" disabled={skillSubmitting} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold flex items-center space-x-2"><Save size={16} /><span>{skillSubmitting ? 'Saving...' : 'Save Skill'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATION MODAL */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/40 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Certification</h3>
              <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCertSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                <input type="text" required value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issuer Organization</label>
                <input type="text" required value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issue Date</label>
                <input type="text" value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} placeholder="e.g. March 2025" className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Credential ID (Optional)</label>
                <input type="text" value={certForm.credentialId} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Certificate File (PDF or Image)</label>
                <input type="file" required accept="image/*,.pdf" onChange={(e) => setCertFile(e.target.files[0])} className="w-full text-sm text-slate-400" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsCertModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-400/40 text-slate-300">Cancel</button>
                <button type="submit" disabled={certSubmitting} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold flex items-center space-x-2"><Save size={16} /><span>{certSubmitting ? 'Uploading...' : 'Save Certificate'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MILESTONE MODAL */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/40 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingMilestone ? 'Edit Milestone' : 'Add Milestone'}</h3>
              <button onClick={() => setIsMilestoneModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleMilestoneSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Year / Period</label>
                <input type="text" required value={milestoneForm.year} onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })} placeholder="e.g. 2024 - Present" className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Role Title</label>
                <input type="text" required value={milestoneForm.title} onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Company / Organization</label>
                <input type="text" value={milestoneForm.company} onChange={(e) => setMilestoneForm({ ...milestoneForm, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <textarea rows={3} required value={milestoneForm.description} onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsMilestoneModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-400/40 text-slate-300">Cancel</button>
                <button type="submit" disabled={milestoneSubmitting} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold flex items-center space-x-2"><Save size={16} /><span>{milestoneSubmitting ? 'Saving...' : 'Save Milestone'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
