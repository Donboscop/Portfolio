import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Briefcase, 
  Plus, 
  Trash2, 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react';
import '../components/CustomAnimation.css';

const Certifications = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  // States
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [file, setFile] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]); // tracks which cards are currently in deletion animation
  
  const [form, setForm] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    verifyUrl: '',
    category: 'practical',
    description: ''
  });

  // Fetch certificates from API
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      // Simulate slight delay to showcase premium shimmer skeletons
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCerts = activeFilter === 'all' 
    ? certificates 
    : certificates.filter(cert => cert.category === activeFilter);

  // Helper to render appropriate category icons
  const getIcon = (category) => {
    switch (category) {
      case 'practical':
        return <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-float" />;
      case 'linkedIn':
        return <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-float" />;
      default:
        return <Layers className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
    }
  };

  // Form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // File selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Add Certificate API trigger
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFormError('Please upload a certificate file.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('issuer', form.issuer);
    formData.append('date', form.date);
    formData.append('credentialId', form.credentialId);
    formData.append('verifyUrl', form.verifyUrl);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('file', file);

    try {
      const res = await authFetch('/api/certifications', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add certificate');
      }

      // Add to certificates state
      setCertificates(prev => [data, ...prev]);
      setIsModalOpen(false);
      
      // Reset form
      setForm({
        title: '',
        issuer: '',
        date: '',
        credentialId: '',
        verifyUrl: '',
        category: 'practical',
        description: ''
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Certificate API trigger (with exit scale-down animation)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    // Trigger card exit animation in CSS
    setDeletingIds(prev => [...prev, id]);
    
    // Wait for the exit animation to finish before calling DB and state updates
    setTimeout(async () => {
      try {
        const response = await authFetch(`/api/certifications/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setCertificates(prev => prev.filter(c => c._id !== id));
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete certificate');
          // Revert exit animation if API calls fails
          setDeletingIds(prev => prev.filter(item => item !== id));
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('An error occurred while deleting');
        setDeletingIds(prev => prev.filter(item => item !== id));
      }
    }, 500);
  };

  // Skeleton Card component representing premium shimmer loading state
  const CertificateSkeleton = () => (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-slate-200/20 dark:border-slate-800/20">
      <div>
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 rounded-xl skeleton-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-20 skeleton-shimmer rounded" />
            <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="h-3 w-full skeleton-shimmer rounded" />
          <div className="h-3 w-5/6 skeleton-shimmer rounded" />
          <div className="h-3 w-4/5 skeleton-shimmer rounded" />
        </div>
        <div className="space-y-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/50">
          <div className="h-3 w-28 skeleton-shimmer rounded" />
          <div className="h-3 w-24 skeleton-shimmer rounded" />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/50 flex justify-between">
        <div className="h-8 w-28 skeleton-shimmer rounded-lg" />
        <div className="h-8 w-16 skeleton-shimmer rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Certifications & <span className="text-gradient">Credentials</span>
        </h2>
        <p className="mt-4 text-lg text-slate-650 dark:text-slate-400">
          Professional verifications of my knowledge, skills, and expertise in software development.
        </p>

        {/* Dynamic add button for Admin only */}
        {isAuthenticated && (
          <div className="mt-6 flex justify-center animate-fade-in-up">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md hover-spring cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {[
          { id: 'all', label: 'All Certifications' },
          { id: 'practical', label: 'Internships & Training' },
          { id: 'linkedIn', label: 'LinkedIn Learning' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white dark:bg-blue-500 hover:shadow-blue-500/10'
                : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CertificateSkeleton />
          <CertificateSkeleton />
          <CertificateSkeleton />
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="text-center p-16 glass-panel rounded-2xl animate-fade-in-up">
          <Layers className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4 animate-float" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No certifications found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-405">There are no records matching the selected category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCerts.map((cert, index) => {
            const isDeleting = deletingIds.includes(cert._id);
            return (
              <div
                // key uses activeFilter to force remount and re-trigger entry animations when filter changes
                key={`${cert._id}-${activeFilter}`}
                style={{ 
                  animationDelay: `${index * 80}ms`,
                  transformOrigin: 'center center'
                }}
                className={`glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden cert-card-hover ${
                  isDeleting ? 'animate-card-exit' : 'animate-card-entry opacity-0'
                }`}
              >
                <div>
                  {/* Header Badging */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900/50 flex-shrink-0 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
                      {getIcon(cert.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                        {cert.issuer}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mt-1 line-clamp-2">
                        {cert.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Meta Details */}
                  <div className="space-y-2 mt-4 border-t border-slate-100 dark:border-slate-900/50 pt-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                      <span>Issued: {cert.date}</span>
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck className="h-3.5 w-3.5 mr-2 text-slate-400" />
                      <span>ID: {cert.credentialId}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/50 flex items-center justify-between gap-4">
                  <a
                    href={cert.pdfUrl.startsWith('http') ? cert.pdfUrl : `${import.meta.env.VITE_API_URL || ''}${cert.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow-blue-500/10 cursor-pointer"
                  >
                    View Certificate
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </a>
                  
                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      Verify ID
                    </a>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-slate-400">Issuer Certified</span>
                  )}

                  {/* Delete button (displays for logged in owners only) */}
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(cert._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 rounded-lg hover-spring cursor-pointer"
                      title="Delete certification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-in & Scale-up Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-modal-backdrop">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-modal-content border border-slate-200/50 dark:border-slate-800/50 overflow-y-auto max-h-[90vh]">
            {/* Close modal button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Award className="text-blue-600 dark:text-blue-400 mr-2 h-5 w-5" />
              Add Certificate Record
            </h3>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-semibold text-red-700 dark:text-red-400 animate-fade-in-up">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Certificate Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Full Stack Development Certification"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Issuer
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    required
                    value={form.issuer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. NoviTech R&D"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    name="date"
                    required
                    value={form.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. June 2025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    required
                    value={form.credentialId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. NOV-FS-2025"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="practical">Internship & Training</option>
                    <option value="linkedIn">LinkedIn Learning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Verification Link
                </label>
                <input
                  type="url"
                  name="verifyUrl"
                  value={form.verifyUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Key training projects, skills, or algorithms covered..."
                />
              </div>

              {/* Upload Certificate File Area */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Certificate File (PDF or Image)
                </label>
                
                <div className="border-2 border-dashed border-slate-350 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/5 dark:hover:bg-blue-950/5 rounded-2xl p-6 text-center hover-dropzone-bounce transition-all relative cursor-pointer flex flex-col items-center justify-center">
                  <input
                    type="file"
                    required
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center animate-fade-in-up">
                      {file.type === 'application/pdf' ? (
                        <FileText className="h-8 w-8 text-red-500 mb-2 dropzone-icon" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-blue-500 mb-2 dropzone-icon" />
                      )}
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[250px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-slate-400 dropzone-icon mb-2" />
                      <span className="text-xs font-bold text-slate-650 dark:text-slate-400 block">
                        Select or Drag Certificate File
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Supports PDF, PNG, JPG, WEBP. Max 10MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 justify-end border-t border-slate-100 dark:border-slate-900/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-350 font-semibold hover:bg-slate-55/50 dark:hover:bg-slate-950/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
                >
                  {formSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Award className="mr-1.5 h-4 w-4" /> Save Record
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

export default Certifications;
