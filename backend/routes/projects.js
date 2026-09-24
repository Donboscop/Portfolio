import express from 'express';
import Project from '../models/Project.js';
import createUploader, { getFileUrl } from '../config/s3.js';
import protect from '../middleware/auth.js';

const router = express.Router();
const upload = createUploader({ maxFileSize: 5 * 1024 * 1024 });

// Helper to parse comma-separated lists and remove empties
const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map(item => item.trim()).filter(Boolean);
};

const mapProject = (doc) => {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  return {
    ...p,
    _id: p._id,
    id: p._id,
    githubLink: p.githubLink || p.github_url || '',
    liveLink: p.liveLink || p.demo_url || '',
    github_url: p.githubLink || p.github_url || '',
    demo_url: p.liveLink || p.demo_url || '',
    image_url: (p.images && p.images[0]) || p.image_url || '',
    challengesFaced: p.challengesFaced || '',
    learningOutcomes: p.learningOutcomes || '',
    createdAt: p.createdAt
  };
};

// @desc    Get all projects (public with search & tech filter)
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, tech } = req.query;
    let queryObj = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      queryObj.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { technologies: searchRegex }
      ];
    }

    if (tech) {
      queryObj.technologies = new RegExp(tech, 'i');
    }

    const projects = await Project.find(queryObj).sort({ createdAt: -1 });
    res.json(projects.map(mapProject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(mapProject(project));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      features,
      challengesFaced,
      learningOutcomes,
      existingImages,
      category,
      featured
    } = req.body;

    const parsedTech = parseList(technologies);
    const parsedFeatures = parseList(features);
    
    // Gather files and format paths (S3 URL or local path)
    const newImageUrls = req.files ? req.files.map(file => getFileUrl(file)) : [];
    const parsedExisting = parseList(existingImages);
    const allImages = [...parsedExisting, ...newImageUrls];

    const isFeatured = featured === 'true' || featured === true;
    const cat = category || 'Web';

    const newProject = await Project.create({
      title,
      description: description || '',
      technologies: parsedTech,
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      images: allImages,
      features: parsedFeatures,
      challengesFaced: challengesFaced || '',
      learningOutcomes: learningOutcomes || '',
      category: cat,
      featured: isFeatured
    });

    res.status(201).json(mapProject(newProject));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const {
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      features,
      challengesFaced,
      learningOutcomes,
      existingImages,
      category,
      featured
    } = req.body;

    const newImageUrls = req.files ? req.files.map(file => getFileUrl(file)) : [];
    const parsedExisting = parseList(existingImages);
    const allImages = existingImages !== undefined ? [...parsedExisting, ...newImageUrls] : project.images;

    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    project.technologies = technologies !== undefined ? parseList(technologies) : project.technologies;
    project.features = features !== undefined ? parseList(features) : project.features;
    project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
    project.liveLink = liveLink !== undefined ? liveLink : project.liveLink;
    project.challengesFaced = challengesFaced !== undefined ? challengesFaced : project.challengesFaced;
    project.learningOutcomes = learningOutcomes !== undefined ? learningOutcomes : project.learningOutcomes;
    project.category = category !== undefined ? category : project.category;
    project.featured = featured !== undefined ? (featured === 'true' || featured === true) : project.featured;
    project.images = allImages;

    const updatedProject = await project.save();
    res.json(mapProject(updatedProject));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Clean up uploaded files
    if (Array.isArray(project.images)) {
      project.images.forEach(img => {
        if (typeof img === 'string' && img.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), img.substring(1));
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(`Failed to delete file ${filePath}:`, err.message);
            }
          }
        }
      });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
