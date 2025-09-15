import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET',
  'DATABASE_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3004'),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Database configuration  
  database: {
    url: process.env.DATABASE_URL!,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET!,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  // CORS configuration
  cors: {
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3005',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3005'],
  },

  // AI configuration
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash-image-preview', // Nano Banana
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    maxFilesPerProject: parseInt(process.env.MAX_FILES_PER_PROJECT || '100'),
  },
};

export default config;
