import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import AnimeWrapper from '../components/AnimeWrapper';
import IconsaxIcon from '../components/IconsaxIcon';
import '../components/CustomAnimation.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimeWrapper animationType="fadeUp" delay={100}>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            Let's Collaborate
          </span>
          <h1 className="fluid-heading-lg text-slate-900 dark:text-white">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Have a project in mind, need AWS cloud setup, or looking for a developer? Send me a message below.
          </p>
        </div>
      </AnimeWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <AnimeWrapper animationType="fadeUp" delay={200}>
            <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Details
              </h3>

              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <IconsaxIcon name="mail" size={22} />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
                    <a href="mailto:donboscop24@gmail.com" className="font-semibold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                      donboscop24@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <IconsaxIcon name="globe" size={22} />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Location</span>
                    <span className="font-semibold text-slate-900 dark:text-white">India / Remote Worldwide</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <IconsaxIcon name="shield" size={22} />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Database & Hosting</span>
                    <span className="font-semibold text-slate-900 dark:text-white">AWS RDS PostgreSQL Free Tier</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimeWrapper>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <AnimeWrapper animationType="fadeUp" delay={300}>
            <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-white/10">
              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-3">
                  <CheckCircle size={22} />
                  <span>Message sent successfully! I will respond to your email shortly.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center space-x-3">
                  <AlertCircle size={22} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello Don Bosco, I would like to discuss..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Send size={18} />
                  <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </AnimeWrapper>
        </div>
      </div>
    </div>
  );
};

export default Contact;
