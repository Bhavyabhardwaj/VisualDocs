import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { BadRequestError } from '../errors';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific directory
    const userId = req.user?.userId || 'anonymous';
    const userUploadDir = path.join(uploadDir, userId);
    
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    
    cb(null, userUploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types for code files
  const allowedMimeTypes = [
    'text/plain',
    'text/javascript',
    'application/javascript',
    'text/typescript',
    'application/typescript',
    'text/x-python',
    'application/x-python-code',
    'text/x-java-source',
    'text/x-c++src',
    'text/x-csharp',
    'application/json',
    'text/markdown',
    'text/yaml',
    'application/x-yaml',
  ];

  const allowedExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.java', '.cpp', '.c', '.h',
    '.cs', '.php', '.rb', '.go',
    '.json', '.md', '.yaml', '.yml',
    '.txt', '.xml', '.html', '.css'
  ];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`File type ${fileExtension} is not supported`));
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    files: parseInt(process.env.MAX_FILES_PER_PROJECT || '100'), // 100 files max
  },
});

// Export different upload configurations
export const singleFileUpload = upload.single('file');
export const multipleFilesUpload = upload.array('files', parseInt(process.env.MAX_FILES_PER_PROJECT || '100'));
export const fieldsUpload = upload.fields([
  { name: 'files', maxCount: parseInt(process.env.MAX_FILES_PER_PROJECT || '100') },
  { name: 'metadata', maxCount: 1 },
]);

// Custom upload error handler
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        throw new BadRequestError('File size too large. Maximum size is 10MB.');
      case 'LIMIT_FILE_COUNT':
        throw new BadRequestError('Too many files. Maximum is 100 files per project.');
      case 'LIMIT_UNEXPECTED_FILE':
        throw new BadRequestError('Unexpected file field.');
      default:
        throw new BadRequestError(`Upload error: ${err.message}`);
    }
  }
  next(err);
};
