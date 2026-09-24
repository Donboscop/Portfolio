import React from 'react';
import { Download, Mail, Phone, MapPin, Briefcase, GraduationCap, Code } from 'lucide-react';
import '../components/CustomAnimation.css';

const Resume = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Header and Download CTA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My <span className="text-gradient">Resume</span>
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Preview my qualifications or download a physical copy.
          </p>
        </div>
        <a
          href="/resume.pdf"
          download="Don_Bosco_P_Resume.pdf"
          className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer hover-spring"
        >
          <Download className="mr-2 h-5 w-5" />
          Download PDF Resume
        </a>
      </div>

      {/* Interactive Digital Resume Preview */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-sm space-y-10">
        
        {/* Contact Info Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-slate-100 dark:border-slate-900">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Don Bosco P</h3>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">Full-Stack MERN Developer</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center"><Mail className="h-4 w-4 mr-2 text-blue-500" /> donboscop24@gmail.com</span>
            <span className="flex items-center"><Phone className="h-4 w-4 mr-2 text-blue-500" /> +91 8220754727</span>
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-blue-500" /> Tiruchirappalli, Tamil Nadu</span>
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center">
            <Briefcase className="mr-2 text-blue-600 dark:text-blue-400 h-5 w-5" /> Work Experience
          </h4>
          <div className="space-y-8 pl-4 border-l border-slate-200 dark:border-slate-800">
            {/* Experience item 1 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 bg-blue-600 dark:bg-blue-400 w-2.5 h-2.5 rounded-full"></span>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                <h5 className="text-lg font-bold text-slate-800 dark:text-slate-200">Web Development Trainee</h5>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">July 2025</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">ILINKS Infotech</p>
              <ul className="list-disc list-inside text-sm text-slate-650 dark:text-slate-355 mt-3 space-y-2">
                <li>Gained hands-on experience in responsive web development and interactive UI design using modern frameworks.</li>
                <li>Acquired debugging and code optimization skills during real-time project iterations.</li>
              </ul>
            </div>

            {/* Experience item 2 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 bg-blue-600 dark:bg-blue-400 w-2.5 h-2.5 rounded-full"></span>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                <h5 className="text-lg font-bold text-slate-800 dark:text-slate-200">Full Stack Development Trainee</h5>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">June 2025 (30 Days)</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">NoviTech R&D Private Limited</p>
              <ul className="list-disc list-inside text-sm text-slate-650 dark:text-slate-355 mt-3 space-y-2">
                <li>Built dynamic full-stack web applications with complete REST API integration and database schemas.</li>
                <li>Authored secure authentication checks and coordinated frontend components with backend endpoints.</li>
              </ul>
            </div>

            {/* Experience item 3 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 bg-blue-600 dark:bg-blue-400 w-2.5 h-2.5 rounded-full"></span>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                <h5 className="text-lg font-bold text-slate-800 dark:text-slate-200">Web Development Intern</h5>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">2024 (2 Months)</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">EdiGlobe</p>
              <ul className="list-disc list-inside text-sm text-slate-650 dark:text-slate-355 mt-3 space-y-2">
                <li>Developed responsive, cross-platform layouts using HTML, CSS, JavaScript, and Bootstrap.</li>
                <li>Worked on debugging code and testing layout responsiveness across different device screens.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center">
            <GraduationCap className="mr-2 text-blue-600 dark:text-blue-400 h-5 w-5" /> Education
          </h4>
          <div className="space-y-6 pl-4 border-l border-slate-200 dark:border-slate-800">
            {/* College */}
            <div className="relative mb-6">
              <span className="absolute -left-[21px] top-1.5 bg-blue-600 dark:bg-blue-400 w-2.5 h-2.5 rounded-full"></span>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                <h5 className="text-lg font-bold text-slate-800 dark:text-slate-200">B.Tech in Information Technology</h5>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">2022 - 2026 (Expected)</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">UCE (BIT Campus), Anna University | Tiruchirappalli</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Cumulative GPA: 7.75/10 (up to 8th semester). Focused on Data Structures, Database Management, and Web Technologies.
              </p>
            </div>

            {/* High School */}
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 bg-blue-600 dark:bg-blue-400 w-2.5 h-2.5 rounded-full"></span>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                <h5 className="text-lg font-bold text-slate-800 dark:text-slate-200">HSC & SSLC Schooling</h5>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">Graduated 2022</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">St. Mary's Higher Secondary School | Manapparai</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Grade 12: 86.16% (2022) | Grade 10: 85.80% (2020).
              </p>
            </div>
          </div>
        </div>

        {/* Technical Summary section */}
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center">
            <Code className="mr-2 text-blue-600 dark:text-blue-400 h-5 w-5" /> Technical Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-650 dark:text-slate-300">
            <div className="space-y-2">
              <p><span className="font-bold text-slate-850 dark:text-slate-205">Languages:</span> JavaScript, Java</p>
              <p><span className="font-bold text-slate-850 dark:text-slate-205">Web Development (MERN):</span> React.js, Node.js, Express.js, MongoDB</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-bold text-slate-850 dark:text-slate-205">Version Control:</span> Git, GitHub</p>
              <p><span className="font-bold text-slate-850 dark:text-slate-205">Soft Skills:</span> Problem-solving, Team collaboration, Leadership, Quick learning</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Resume;
