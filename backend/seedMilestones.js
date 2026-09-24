import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const milestoneList = [
  {
    year: 'August 2026',
    title: 'AI & Emerging Tech Insights',
    company: 'Microsoft Innovation Hub (Bengaluru)',
    description: 'Attended the AI Workshop at Microsoft Innovation Hub (Bengaluru) focused on Generative AI, Agentic AI workflows, and modern engineering practices.'
  },
  {
    year: 'July 2026',
    title: 'AWS & Cloud Architecture',
    company: 'GCC Summit 2026 (Bengaluru)',
    description: 'Participated in the GCC Summit 2026 in Bengaluru, focusing on enterprise Cloud Computing, AI, and Intelligent Automation. Earned the AWS Cloud Quest: Cloud Practitioner certification.'
  },
  {
    year: 'June 2026',
    title: 'Cloud & Linux Fundamentals',
    company: 'Don Bosco Skill Mission (DBSM), Bangalore',
    description: 'Selected for the AWS re/Start Cloud Practitioner Program at Don Bosco Skill Mission (DBSM), Bangalore. Completed Linux training via KodeKloud.'
  },
  {
    year: 'Jan 2025 – Feb 2025',
    title: 'Full-Stack MasterClass',
    company: 'NoviTech R&D',
    description: 'Completed the 30-Day Full-Stack Development MasterClass conducted by NoviTech R&D.'
  }
];

async function seed() {
  console.log('Seeding Milestones to MongoDB Atlas...');

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  try {
    await mongoose.connect(mongoUri);
    const MsSchema = new mongoose.Schema({
      year: String,
      title: String,
      company: String,
      description: String
    }, { timestamps: true });

    const MsModel = mongoose.models.Milestone || mongoose.model('Milestone', MsSchema);

    await MsModel.deleteMany({});
    for (const item of milestoneList) {
      await MsModel.create(item);
    }
    console.log('✅ MongoDB Atlas Milestones Seeded Successfully!');
  } catch (err) {
    console.error('[MongoDB Error]:', err.message);
  }

  console.log('Done!');
  process.exit(0);
}

seed();
