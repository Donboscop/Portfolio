import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, ExternalLink, Sparkles, Terminal, Code2, Database, Server, Mail, CheckCircle, Send, X, ShieldCheck } from 'lucide-react';
import AnimeWrapper from '../components/AnimeWrapper';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch live data from backend API
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setProjects(data))
      .catch((err) => console.error('Error fetching projects:', err));

    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setSkills(data))
      .catch((err) => console.error('Error fetching skills:', err));

    fetch('/api/milestones')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setMilestones(data))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  const categories = ['All', 'Web Application', 'Portfolio', 'Game', 'Backend Application'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSubmitting(true);
    setContactStatus(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        setContactStatus({ type: 'success', message: 'Message sent successfully! I will reply to your email soon.' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactStatus({ type: 'error', message: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      setIsSubmitting(false);
      setContactStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="relative min-h-screen pt-20 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-32">
        
        {/* ================= HERO SECTION (Clearance & Alignment Upgrade) ================= */}
        <section className="pt-24 sm:pt-32 lg:pt-36">
          <AnimeWrapper animationType="fadeUp" delay={100}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase">
                Full-Stack MERN & AWS Cloud Developer
              </span>
            </div>
          </AnimeWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Header Content */}
            <div className="lg:col-span-7 space-y-6">
              <AnimeWrapper animationType="fadeUp" delay={200}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">scalable web applications</span> with cloud-ready architecture.
                </h1>
              </AnimeWrapper>

              <AnimeWrapper animationType="fadeUp" delay={300}>
                <p className="text-base sm:text-xl font-normal text-slate-300 max-w-2xl leading-relaxed">
                  Hi, I'm <strong className="text-white font-semibold">Don Bosco P</strong>. I craft high-performance full-stack applications using the MERN stack and build secure, resilient cloud infrastructure on AWS.
                </p>
              </AnimeWrapper>

              <AnimeWrapper animationType="fadeUp" delay={400}>
                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <a
                    href="#projects"
                    className="px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:scale-105 cursor-pointer flex items-center space-x-2"
                  >
                    <span>View Projects</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#contact"
                    className="px-7 py-3.5 rounded-full glass-panel text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    Contact Me
                  </a>

                  <Link
                    to="/resume"
                    className="px-6 py-3.5 rounded-full border border-white/10 text-slate-300 font-semibold text-xs tracking-wider uppercase hover:border-indigo-500/50 hover:text-white transition-all cursor-pointer"
                  >
                    Resume
                  </Link>
                </div>
              </AnimeWrapper>
            </div>

            {/* Right Profile Spotlight Card with Vercel Glow Backdrop */}
            <div className="lg:col-span-5 relative">
              {/* Radial Background Glow Spotlight */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-cyan-500/25 blur-3xl opacity-80 pointer-events-none" />

              <AnimeWrapper animationType="float" delay={500}>
                <div className="bg-[#111726] p-6 rounded-3xl border border-white/10 relative overflow-hidden group shadow-2xl">
                  
                  {/* Profile Photo - Constrained Height for Viewport Fit */}
                  <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden mb-5 border border-indigo-500/30 shadow-xl">
                    <img
                      src="/profile.jpg"
                      alt="Don Bosco P"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Live Availability Badge */}
                    <div className="absolute top-3 left-3 bg-[#090d16]/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 flex items-center space-x-2 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-semibold text-white tracking-wide">Available for Work</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-editorial text-2xl font-extrabold text-[#F8FAFC]">Don Bosco P</h3>
                      <p className="text-xs font-mono tracking-widest text-indigo-400 uppercase mt-0.5">Full-Stack MERN & AWS Cloud Engineer</p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Passionate software engineer building resilient web apps, cloud backend systems, and interactive UI experiences.
                    </p>

                    <div className="pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                      {['MongoDB Atlas', 'React 19', 'Node.js', 'Express', 'Spring Boot', 'AWS EC2 & S3'].map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-[11px] font-semibold rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimeWrapper>
            </div>
          </div>
        </section>

        {/* ================= PROJECTS SHOWCASE (olouen style) ================= */}
        <section id="projects" className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold block mb-2">
                01 / Portfolio Showcase
              </span>
              <h2 className="fluid-heading-lg text-white">Featured Works</h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'glass-panel text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {project.category || 'Web Application'}
                    </span>
                    
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2.5 rounded-full bg-white/5 hover:bg-purple-600 hover:text-white text-slate-300 transition-all cursor-pointer"
                      title="View Details"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-editorial text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-300 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Array.isArray(project.technologies) &&
                      project.technologies.slice(0, 5).map((tech, idx) => (
                        <span key={idx} className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">
                          {tech}
                        </span>
                      ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-purple-400 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}

                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SKILLS & EXPERTISE ================= */}
        <section className="space-y-12">
          <div className="border-b border-white/10 pb-8">
            <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold block mb-2">
              02 / Technical Competencies
            </span>
            <h2 className="fluid-heading-lg text-white">Skills & Technologies</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Frontend', icon: Code2, techList: ['React 19', 'Vite', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 & CSS3'] },
              { title: 'Backend', icon: Server, techList: ['Node.js', 'Express.js', 'Spring Boot (Java)', 'REST APIs', 'JWT Auth'] },
              { title: 'Database', icon: Database, techList: ['MongoDB Atlas', 'Mongoose ORM', 'PostgreSQL', 'Cloud Backups'] },
              { title: 'DevOps & Cloud', icon: Terminal, techList: ['AWS EC2 & S3', 'Nginx Proxy', 'PM2 Manager', 'Docker & Linux'] }
            ].map((col, idx) => {
              const IconComp = col.icon;
              return (
                <div key={idx} className="glass-card rounded-3xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-white mb-4">{col.title}</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {col.techList.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= TIMELINE MILESTONES ================= */}
        <section className="space-y-12">
          <div className="border-b border-white/10 pb-8">
            <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold block mb-2">
              03 / Timeline & Milestones
            </span>
            <h2 className="fluid-heading-lg text-white">Career Experience</h2>
          </div>

          <div className="space-y-6">
            {milestones.map((ms) => (
              <div key={ms._id} className="glass-card rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400 block mb-2">
                    {ms.year}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-white">{ms.title}</h3>
                  <p className="text-sm font-semibold text-slate-400 mb-3">{ms.company}</p>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">{ms.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT FORM ================= */}
        <section id="contact" className="space-y-12">
          <div className="border-b border-white/10 pb-8">
            <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold block mb-2">
              04 / Get In Touch
            </span>
            <h2 className="fluid-heading-lg text-white">Send Me a Message</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-editorial text-3xl font-bold text-white">Let's discuss your next project.</h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Whether you have an opportunity, a full-stack project idea, or just want to connect, feel free to send a message.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">Email</span>
                    <a href="mailto:donboscop24@gmail.com" className="text-white font-bold hover:text-purple-400 transition-colors">
                      donboscop24@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="glass-card rounded-3xl p-8 space-y-6">
                {contactStatus && (
                  <div className={`p-4 rounded-2xl text-sm font-semibold flex items-center space-x-3 ${
                    contactStatus.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{contactStatus.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Hello Don Bosco, I would like to discuss..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel max-w-2xl w-full p-8 rounded-3xl border border-white/20 relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {selectedProject.category || 'Project'}
            </span>

            <h2 className="font-editorial text-3xl font-bold text-white">{selectedProject.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.description}</p>

            {Array.isArray(selectedProject.features) && selectedProject.features.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 font-bold">Key Features</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
              {selectedProject.githubLink && (
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repo</span>
                </a>
              )}

              {selectedProject.liveLink && (
                <a
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
