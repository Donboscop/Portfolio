import pool, { initDB } from './config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const certList = [
  {
    title: 'Java Foundations Professional Certificate',
    issuer: 'JetBrains & LinkedIn',
    date: '2025',
    credentialId: 'JETBRAINS-JAVA-2025',
    pdfUrl: '/uploads/CertificateOfCompletion_Java_Foundations_Professional_Certificate_by_JetBrains.pdf',
    category: 'linkedIn',
    description: 'Comprehensive Java software engineering foundation certified by JetBrains.'
  },
  {
    title: 'Java Essential Training: Objects and APIs',
    issuer: 'LinkedIn Learning',
    date: '2025',
    credentialId: 'LINKEDIN-JAVA-OBJ',
    pdfUrl: '/uploads/CertificateOfCompletion_Java_Essential_Training_Objects_and_APIs.pdf',
    category: 'linkedIn',
    description: 'Object-oriented programming, class hierarchies, and Java API libraries.'
  },
  {
    title: 'Java Data Structures',
    issuer: 'LinkedIn Learning',
    date: '2025',
    credentialId: 'LINKEDIN-JAVA-DS',
    pdfUrl: '/uploads/CertificateOfCompletion_Java_Data_Structures.pdf',
    category: 'linkedIn',
    description: 'Mastery of fundamental data structures, algorithms, and collections.'
  },
  {
    title: 'Java Essential Training: Syntax & Structure',
    issuer: 'LinkedIn Learning',
    date: '2025',
    credentialId: 'LINKEDIN-JAVA-SYNTAX',
    pdfUrl: '/uploads/CertificateOfCompletion_Java_Essential_Training_Syntax_and_Structure.pdf',
    category: 'linkedIn',
    description: 'Core Java syntax, control flow, functions, and memory management.'
  },
  {
    title: 'Java Object-Oriented Programming',
    issuer: 'LinkedIn Learning',
    date: '2025',
    credentialId: 'LINKEDIN-JAVA-OOP',
    pdfUrl: '/uploads/CertificateOfCompletion_Java_ObjectOriented_Programming.pdf',
    category: 'linkedIn',
    description: 'Advanced encapsulation, inheritance, polymorphism, and abstraction.'
  },
  {
    title: 'Full Stack Web Development Internship',
    issuer: 'NoviTech R&D',
    date: '2025',
    credentialId: 'NOV-FS-2025',
    pdfUrl: '/uploads/novitech_Full_Stack_.pdf',
    category: 'practical',
    description: 'Hands-on practical full stack web development training and project work.'
  },
  {
    title: 'Web Development Certification',
    issuer: 'EdgeGlobe',
    date: '2025',
    credentialId: 'EDGE-WEB-2025',
    pdfUrl: '/uploads/Edeglobe_Web.pdf',
    category: 'practical',
    description: 'Professional web development training and frontend implementation.'
  },
  {
    title: 'Web Development Internship',
    issuer: 'iLinks Technologies',
    date: '2025',
    credentialId: 'ILINKS-WEB-2025',
    pdfUrl: '/uploads/web_ilinks.pdf',
    category: 'practical',
    description: 'Practical web software development internship training.'
  }
];

async function seed() {
  console.log('Starting Certificate Seeding Process...');

  // 1. Seed MongoDB Atlas AWS if MONGO_URI exists
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      const CertSchema = new mongoose.Schema({
        title: String,
        issuer: String,
        date: String,
        credentialId: String,
        pdfUrl: String,
        category: String,
        description: String
      }, { timestamps: true });

      const CertModel = mongoose.models.Certificate || mongoose.model('Certificate', CertSchema);

      for (const item of certList) {
        const exists = await CertModel.findOne({ pdfUrl: item.pdfUrl });
        if (!exists) {
          await CertModel.create(item);
          console.log(`[MongoDB] Added: ${item.title}`);
        } else {
          console.log(`[MongoDB] Already Exists: ${item.title}`);
        }
      }
      console.log('✅ MongoDB Atlas Certificates Seeded Successfully!');
    } catch (err) {
      console.error('[MongoDB Error]:', err.message);
    }
  }

  // 2. Seed PostgreSQL Cloud Table
  try {
    await initDB();
    
    // Ensure table columns exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        credential_id VARCHAR(255),
        pdf_url VARCHAR(500),
        verify_url VARCHAR(500),
        category VARCHAR(100) DEFAULT 'practical',
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const item of certList) {
      const checkRes = await pool.query('SELECT id FROM certificates WHERE pdf_url = $1', [item.pdfUrl]);
      if (checkRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO certificates (title, issuer, date, credential_id, pdf_url, category, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [item.title, item.issuer, item.date, item.credentialId, item.pdfUrl, item.category, item.description]
        );
        console.log(`[PostgreSQL] Added: ${item.title}`);
      } else {
        console.log(`[PostgreSQL] Already Exists: ${item.title}`);
      }
    }
    console.log('✅ PostgreSQL Certificates Seeded Successfully!');
  } catch (err) {
    console.error('[PostgreSQL Error]:', err.message);
  }

  console.log('Done!');
  process.exit(0);
}

seed();
