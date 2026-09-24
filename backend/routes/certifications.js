import express from 'express';
import createUploader, { getFileUrl } from '../config/s3.js';
import Certificate from '../models/Certificate.js';
import protect from '../middleware/auth.js';

const router = express.Router();
const upload = createUploader({ maxFileSize: 10 * 1024 * 1024 });

const mapCertificate = (doc) => {
  if (!doc) return null;
  const c = doc.toObject ? doc.toObject() : doc;
  return {
    ...c,
    _id: c._id,
    id: c._id,
    credentialId: c.credentialId,
    verifyUrl: c.verifyUrl,
    pdfUrl: c.pdfUrl,
    date: c.date,
    createdAt: c.createdAt
  };
};

// @desc    Get all certificates
// @route   GET /api/certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certs.map(mapCertificate));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new certificate
// @route   POST /api/certifications
// @access  Private/Admin
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      issuer,
      date,
      credentialId,
      verifyUrl,
      category,
      description
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Certificate file (PDF or Image) is required' });
    }

    if (credentialId) {
      const existing = await Certificate.findOne({ credentialId });
      if (existing) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'A certificate with this Credential ID already exists' });
      }
    }

    const pdfUrl = getFileUrl(req.file);

    const newCert = await Certificate.create({
      title,
      issuer,
      date: date || '',
      credentialId: credentialId || `CERT-${Date.now()}`,
      verifyUrl: verifyUrl || '',
      pdfUrl,
      category: category || 'practical',
      description: description || ''
    });

    res.status(201).json(mapCertificate(newCert));
  } catch (error) {
    console.error('Error creating certificate:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to clean up file after DB error:', err.message);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a certificate
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (cert.pdfUrl && cert.pdfUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), cert.pdfUrl.substring(1));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete certificate file ${filePath}:`, err.message);
        }
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
