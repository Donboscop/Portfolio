import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import IconsaxIcon from './IconsaxIcon';

export default function ProjectCard({ project, isAuthenticated, onEdit, onDelete }) {
  const {
    id,
    _id,
    title,
    description,
    technologies = [],
    tags = [],
    githubLink,
    liveLink,
    images = [],
    image_url,
    category = 'Web'
  } = project;

  const projId = id !== undefined && id !== null ? id : (_id !== undefined && _id !== null ? _id : '');
  const techList = Array.isArray(technologies) && technologies.length > 0 ? technologies : (Array.isArray(tags) ? tags : []);
  const thumbnail = (Array.isArray(images) && images[0]) || image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/50 dark:border-white/10 hover:border-purple-500/40 transition-all duration-500 group flex flex-col justify-between hover:shadow-2xl hover:shadow-purple-500/10">
      <div>
        {/* Project Thumbnail with Hover Zoom */}
        <div className="relative h-56 overflow-hidden bg-slate-950/20">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
          
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-600/90 text-white shadow-md">
            {category}
          </span>

          {/* Quick Action Overlay Icons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-purple-600 text-white backdrop-blur-md transition-colors"
                title="GitHub Source"
              >
                <Github size={16} />
              </a>
            )}
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-purple-600 text-white backdrop-blur-md transition-colors"
                title="Live Demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {description}
          </p>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {techList.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20"
              >
                {tech}
              </span>
            ))}
            {techList.length > 4 && (
              <span className="px-2 py-1 text-xs font-medium text-slate-500">
                +{techList.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Details & Admin Controls */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-200/40 dark:border-white/5">
        <Link
          to={`/projects/${projId}`}
          className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 group/link"
        >
          <span>View Details</span>
          <ArrowUpRight className="ml-1 w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>

        {isAuthenticated && (
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-500/10"
              title="Edit Project"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(projId)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
