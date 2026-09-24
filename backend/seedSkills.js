import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const skillList = [
  { name: 'React.js', category: 'frontend', level: 90, icon: 'code' },
  { name: 'Node.js', category: 'backend', level: 85, icon: 'server' },
  { name: 'Express.js', category: 'backend', level: 85, icon: 'cpu' },
  { name: 'MongoDB', category: 'database', level: 80, icon: 'database' },
  { name: 'AWS Cloud', category: 'database', level: 85, icon: 'cloud' },
  { name: 'Linux (Bash)', category: 'devops', level: 75, icon: 'terminal' },
  { name: 'Java', category: 'backend', level: 80, icon: 'code' },
  { name: 'Git & GitHub', category: 'devops', level: 85, icon: 'git-branch' }
];

async function seed() {
  console.log('Seeding Skills to MongoDB Atlas...');

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  try {
    await mongoose.connect(mongoUri);
    const SkillSchema = new mongoose.Schema({
      name: String,
      category: String,
      level: Number,
      icon: String
    }, { timestamps: true });

    const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

    await SkillModel.deleteMany({});
    for (const item of skillList) {
      await SkillModel.create(item);
    }
    console.log('✅ MongoDB Atlas Skills Seeded Successfully!');
  } catch (err) {
    console.error('[MongoDB Error]:', err.message);
  }

  console.log('Done!');
  process.exit(0);
}

seed();
