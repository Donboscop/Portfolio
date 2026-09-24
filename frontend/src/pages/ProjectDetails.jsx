import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Code2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import AnimeWrapper from '../components/AnimeWrapper';
import IconsaxIcon from '../components/IconsaxIcon';
import '../components/CustomAnimation.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          throw new Error('Project details not found');
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-xl mx-auto text-center">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Project Not Found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{error || 'This project might have been removed.'}</p>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-600/30 hover:bg-purple-700 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const techList = Array.isArray(project.technologies) && project.technologies.length > 0
    ? project.technologies
    : (Array.isArray(project.tags) ? project.tags : []);

  const featureList = Array.isArray(project.features) ? project.features : [];
  const imageList = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : (project.image_url ? [project.image_url] : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=60']);

  const githubLink = project.githubLink || project.github_url || '';
  const liveLink = project.liveLink || project.demo_url || '';

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back navigation link */}
      <AnimeWrapper animationType="fadeUp" delay={100}>
        <Link
          to="/projects"
          className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </AnimeWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Image Display */}
        <div className="lg:col-span-7 space-y-6">
          <AnimeWrapper animationType="fadeUp" delay={200}>
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/10 bg-slate-950/20 relative">
              <div className="h-72 sm:h-[420px] w-full flex items-center justify-center">
                <img
                  src={imageList[activeImageIndex] || imageList[0]}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=60';
                  }}
                />
              </div>
            </div>
          </AnimeWrapper>

          {/* Thumbnails list */}
          {imageList.length > 1 && (
            <AnimeWrapper animationType="fadeUp" delay={250}>
              <div className="flex gap-3 overflow-x-auto py-2">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-24 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-purple-600 dark:border-purple-400 scale-95 shadow-md'
                        : 'border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=60';
                      }}
                    />
                  </button>
                ))}
              </div>
            </AnimeWrapper>
          )}

          {/* Core Info Panel */}
          <AnimeWrapper animationType="fadeUp" delay={300}>
            <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  {project.category || 'Web'}
                </span>
                <h1 className="fluid-heading-md mt-3 text-slate-900 dark:text-white">
                  {project.title}
                </h1>
              </div>

              {techList.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techList.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 rounded-xl text-xs font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Overview</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>
          </AnimeWrapper>
        </div>

        {/* Right Column - Links, Features, Challenges */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Links Card */}
          <AnimeWrapper animationType="fadeUp" delay={300}>
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3.5 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  <Github className="mr-2 h-4 w-4" /> Source Code
                </a>
              )}
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              )}
            </div>
          </AnimeWrapper>

          {/* Key Features */}
          {featureList.length > 0 && (
            <AnimeWrapper animationType="fadeUp" delay={350}>
              <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <IconsaxIcon name="code" size={20} />
                  <span>Key Features</span>
                </h3>
                <ul className="space-y-3">
                  {featureList.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimeWrapper>
          )}

          {/* Challenges faced */}
          {project.challengesFaced && (
            <AnimeWrapper animationType="fadeUp" delay={400}>
              <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-amber-500">
                  <HelpCircle className="h-5 w-5" />
                  <span>Challenges Faced</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {project.challengesFaced}
                </p>
              </div>
            </AnimeWrapper>
          )}

          {/* Learning outcomes */}
          {project.learningOutcomes && (
            <AnimeWrapper animationType="fadeUp" delay={450}>
              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-emerald-500">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Learning Outcomes</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {project.learningOutcomes}
                </p>
              </div>
            </AnimeWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
