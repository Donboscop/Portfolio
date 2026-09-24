import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeWrapper from '../components/AnimeWrapper';
import ProjectCard from '../components/ProjectCard';
import IconsaxIcon from '../components/IconsaxIcon';
import '../components/CustomAnimation.css';

const Projects = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [activeTech, setActiveTech] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const quickFilters = ['React', 'Node', 'PostgreSQL', 'Express', 'Tailwind', 'AWS'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = '/api/projects';
      const params = [];
      
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }
      if (activeTech) {
        params.push(`tech=${encodeURIComponent(activeTech)}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch projects');
      }
      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, activeTech]);

  const handleTechClick = (tech) => {
    setActiveTech(prev => (prev === tech ? '' : tech));
  };

  const startAddProject = () => {
    setEditingProject(null);
    setProjectForm({
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
    setSelectedFiles([]);
    setFormError(null);
    setIsModalOpen(true);
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
    setSelectedFiles([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await authFetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete project');
      }
      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
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

      projectForm.existingImages.forEach(img => {
        formData.append('existingImages', img);
      });

      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const url = editingProject ? `/api/projects/${editingProject.id || editingProject._id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Operation failed');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Title */}
      <AnimeWrapper animationType="fadeUp" delay={100}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              Adri Fluid Portfolio
            </span>
            <h1 className="fluid-heading-lg mt-3 text-slate-900 dark:text-white">
              Featured Projects
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Explore full-stack web applications, PostgreSQL schemas, and interactive cloud systems.
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={startAddProject}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Add New Project</span>
            </button>
          )}
        </div>
      </AnimeWrapper>

      {/* Filter and Search Bar */}
      <AnimeWrapper animationType="fadeUp" delay={200}>
        <div className="glass-panel p-4 rounded-3xl mb-12 border border-slate-200/50 dark:border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-transparent focus:border-purple-500 text-sm text-slate-900 dark:text-white outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {quickFilters.map((tech) => (
              <button
                key={tech}
                onClick={() => handleTechClick(tech)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTech === tech
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </AnimeWrapper>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading projects...</div>
      ) : error ? (
        <div className="py-20 text-center text-red-500 flex items-center justify-center space-x-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center text-slate-500 glass-panel rounded-3xl">
          No projects match your filter criteria.
        </div>
      ) : (
        <AnimeWrapper animationType="staggerChildren" delay={300} stagger={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id || proj._id}
              project={proj}
              isAuthenticated={isAuthenticated}
              onEdit={startEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </AnimeWrapper>
      )}

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/40 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm border border-red-500/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  >
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
                  <input
                    type="url"
                    value={projectForm.githubLink}
                    onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Live Demo Link</label>
                  <input
                    type="url"
                    value={projectForm.liveLink}
                    onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Images (Upload files)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  className="w-full text-sm text-slate-400"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-400/40 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{formSubmitting ? 'Saving...' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
