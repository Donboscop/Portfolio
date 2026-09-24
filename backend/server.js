import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './config/db.js';
import fs from 'fs';
import Project from './models/Project.js';

// Load route files
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import statsRoutes from './routes/stats.js';
import messageRoutes from './routes/messages.js';
import certificationRoutes from './routes/certifications.js';
import skillsRoutes from './routes/skills.js';
import milestoneRoutes from './routes/milestones.js';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to find .env in backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists and serve static
const uploadDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create uploads directory:', err.message);
}
app.use('/uploads', express.static(uploadDir));

// Connect DB middleware for Serverless environment
app.use(async (req, res, next) => {
  await initDB();
  next();
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'MongoDB Atlas Backend server is running.' }));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/milestones', milestoneRoutes);

// AI Bot & Web Crawler Pre-rendering Helper
const isBotUserAgent = (userAgent = '') => {
  const bots = ['bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'gpt', 'claude', 'perplexity', 'facebook', 'linkedin', 'twitter', 'slack'];
  const ua = userAgent.toLowerCase();
  return bots.some((b) => ua.includes(b));
};

// Serve Frontend Static Build in Production with Dynamic AI Bot Pre-rendering
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));

  app.get('*', async (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    const userAgent = req.headers['user-agent'] || '';

    if (isBotUserAgent(userAgent) && fs.existsSync(indexPath)) {
      try {
        let html = fs.readFileSync(indexPath, 'utf8');
        const dbProjects = await Project.find().sort({ createdAt: -1 });

        const projectsHtml = dbProjects.map(p => `
          <article>
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p><strong>Technologies:</strong> ${(p.technologies || []).join(', ')}</p>
            ${p.githubLink ? `<a href="${p.githubLink}">GitHub Code</a>` : ''}
            ${p.liveLink ? `<a href="${p.liveLink}">Live Demo</a>` : ''}
          </article>
        `).join('\n');

        const botHtmlContent = `
          <div id="ai-prerender-content">
            <header>
              <h1>Don Bosco P — Full-Stack MERN & AWS Cloud Developer</h1>
              <p>Full-Stack Software Engineer specializing in MERN Stack, Spring Boot REST APIs, and AWS Cloud Engineering based in Bangalore, India.</p>
              <p>Email: donboscop24@gmail.com | Phone: +91 8220754727</p>
            </header>
            <section>
              <h2>Portfolio Projects (${dbProjects.length})</h2>
              ${projectsHtml}
            </section>
          </div>
        `;

        // Inject dynamic project HTML directly into root container for AI bots
        html = html.replace('<div id="root"></div>', `<div id="root">${botHtmlContent}</div>`);
        return res.send(html);
      } catch (err) {
        console.error('Error pre-rendering bot HTML:', err);
      }
    }

    res.sendFile(indexPath);
  });
} else if (!process.env.VERCEL) {
  app.get('/', (req, res) => {
    res.send('Portfolio API Server is running (MongoDB Atlas Enabled)');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Initialize DB and start listening if not running on Vercel
initDB().catch(err => console.error('Database initialization error:', err));

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
