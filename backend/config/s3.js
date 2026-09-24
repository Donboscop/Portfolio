import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const isS3Configured = () => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  );
};

let s3Client = null;

if (isS3Configured()) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

// Local Storage Fallback
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const createUploader = ({ allowedTypes = /jpeg|jpg|png|webp|gif|pdf/i, maxFileSize = 10 * 1024 * 1024 } = {}) => {
  let storage;

  if (isS3Configured() && s3Client) {
    console.log('☁️ AWS S3 Storage Enabled for uploads');
    storage = multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const folder = file.mimetype.includes('pdf') ? 'certificates' : 'images';
        const uniqueName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });
  } else {
    storage = localStorage;
  }

  return multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter(req, file, cb) {
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype) || /image|pdf/i.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error(`File type not allowed! Allowed: ${allowedTypes}`));
      }
    },
  });
};

// Helper function to extract URL from multer file object (S3 location vs local path)
export const getFileUrl = (file) => {
  if (!file) return '';
  if (file.location) {
    return file.location; // AWS S3 URL: https://bucket.s3.region.amazonaws.com/...
  }
  return `/uploads/${file.filename}`; // Local path
};

export default createUploader;
