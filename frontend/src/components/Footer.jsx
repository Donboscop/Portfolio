import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Eye, ShieldCheck, ArrowUp } from 'lucide-react';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setVisitorCount(data.count);
        }
      } catch (err) {
        console.error('Failed to load visitor statistics:', err);
      }
    };
    fetchStats();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 glass-panel backdrop-blur-2xl py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Editorial Top Callout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-10 border-b border-white/10 mb-8 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold block mb-2">
              Let's Build Something Exceptional
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to bring your ideas to life?
            </h3>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Get In Touch ➔
            </Link>

            <button
              onClick={scrollToTop}
              className="p-3.5 rounded-full border border-white/10 hover:border-purple-500/50 hover:bg-white/5 text-slate-300 transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Footer Bottom Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-sm font-medium">
          
          <div className="flex items-center space-x-3">
            <p>© {new Date().getFullYear()} Don Bosco P. MongoDB Atlas & AWS EC2 Enabled.</p>
          </div>

          {/* Visitor Counter Badge */}
          {visitorCount !== null && (
            <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300">
              <Eye className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span>Visitors: {visitorCount.toLocaleString()}</span>
            </div>
          )}

          {/* Social Links & Admin Entry */}
          <div className="flex items-center space-x-5">
            <a
              href="https://github.com/Donboscop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/don-bosco-29a4b52aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>

            <a
              href="mailto:donboscop24@gmail.com"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              aria-label="Email Address"
            >
              <Mail className="h-5 w-5" />
            </a>

            <Link
              to="/admin/login"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors border border-transparent hover:border-purple-500/20"
              title="Admin Login Portal"
            >
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
