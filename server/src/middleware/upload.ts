import multer from 'multer';
import path from 'path';
import fs from 'fs';

const MAX_FILE_SIZE_MB = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB || 10);
const MAX_FILES_PER_REQUEST = Number(process.env.UPLOAD_MAX_FILES_PER_REQUEST || 500);
const TEMP_UPLOAD_DIR = process.env.UPLOAD_TEMP_DIR || path.join(process.cwd(), 'uploads', 'temp');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directory if it doesn't exist
    if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
      fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
    }
    
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only certain file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file extensions
  const allowedExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.java', '.cpp', '.c',
    '.go', '.rs', '.php', '.rb',
    '.swift', '.kt', '.cs', '.vue',
    '.svelte', '.html', '.css', '.scss',
    '.json', '.md', '.txt', '.xml',
    '.yaml', '.yml'
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not allowed. Only code files are permitted.`));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: MAX_FILES_PER_REQUEST
  }
});

// Middleware for multiple file uploads
export const multipleFilesUpload = upload.array('files', MAX_FILES_PER_REQUEST);

// Middleware for single file upload
export const singleFileUpload = upload.single('file');

// Error handler for multer errors
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
        code: 'FILE_TOO_LARGE'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: `Too many files. Maximum ${MAX_FILES_PER_REQUEST} files allowed per request`,
        code: 'TOO_MANY_FILES'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field',
        code: 'UNEXPECTED_FIELD'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'File upload failed',
      code: 'UPLOAD_ERROR'
    });
  }
  
  next();
};
