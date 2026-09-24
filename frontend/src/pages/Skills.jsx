import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeWrapper from '../components/AnimeWrapper';
import IconsaxIcon from '../components/IconsaxIcon';
import '../components/CustomAnimation.css';

const SKILL_DESCRIPTIONS = {
  'React.js': 'Advanced / Single Page Applications & UI',
  'Node.js': 'Intermediate / REST API & Middleware',
  'Express.js': 'Intermediate / Web Framework',
  'MongoDB': 'Intermediate / NoSQL & Atlas',
  'PostgreSQL': 'Intermediate / Relational Database',
  'AWS Cloud': 'Certified Cloud Practitioner',
  'Linux (Bash)': 'Basic/Intermediate CLI Operations',
  'Java': 'OOP & Data Structures',
  'Git & GitHub': 'Version Control'
};

const Skills = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    level: 85,
    category: 'frontend',
    icon: 'code'
  });

  const categories = [
    { id: 'all', label: 'All Stack', icon: 'sparkles' },
    { id: 'frontend', label: 'Frontend', icon: 'layout' },
    { id: 'backend', label: 'Backend', icon: 'server' },
    { id: 'database', label: 'Database & Cloud', icon: 'database' },
    { id: 'devops', label: 'DevOps & Tools', icon: 'terminal' }
  ];

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setForm({ name: '', level: 85, category: 'frontend', icon: 'code' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name || '',
      level: skill.level || 85,
      category: skill.category || 'frontend',
      icon: skill.icon || 'code'
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await authFetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill');
      fetchSkills();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id || editingSkill._id}` : '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Skill operation failed');
      }

      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <AnimeWrapper animationType="fadeUp" delay={100}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              Technical Competencies
            </span>
            <h1 className="fluid-heading-lg mt-3 text-slate-900 dark:text-white">
              Skills & Tech Stack
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Engineered with modern languages, PostgreSQL, MERN stack, Java, and AWS cloud infrastructure.
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={openAddModal}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Skill</span>
            </button>
          )}
        </div>
      </AnimeWrapper>

      {/* Category Pills */}
      <AnimeWrapper animationType="fadeUp" delay={200}>
        <div className="flex flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-purple-500/10 border border-slate-200/50 dark:border-white/10'
              }`}
            >
              <IconsaxIcon name={cat.icon} size={16} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </AnimeWrapper>

      {/* Skills Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading technical skills...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="py-16 text-center text-slate-500 glass-panel rounded-3xl">
          No skills listed in this category yet.
        </div>
      ) : (
        <AnimeWrapper animationType="staggerChildren" delay={300} stagger={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const skillId = skill.id || skill._id;
            const desc = SKILL_DESCRIPTIONS[skill.name] || `${skill.category} Development`;
            return (
              <div
                key={skillId}
                className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <IconsaxIcon name={skill.icon || 'code'} size={22} />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative mt-4">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="pt-4 mt-4 flex justify-end space-x-2 border-t border-slate-200/40 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-purple-500/10"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(skillId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </AnimeWrapper>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/40 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Proficiency Level ({form.level}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: parseInt(e.target.value, 10) })}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database & Cloud</option>
                  <option value="devops">DevOps & Tools</option>
                </select>
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
                  <span>{formSubmitting ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
