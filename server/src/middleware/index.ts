// Export all middleware
export * from './authMiddleware';
export * from './rateLimiter';
export * from './errorHandler';
export * from './requestLogger';
export * from './security';
export * from './upload';
export * from './oauthMiddleware';

// Export grouped middleware for easy import
export { isAuthenticated, requireRole, requireAdmin, requireSuperAdmin, optionalAuth } from './authMiddleware';
export { generalLimiter, authLimiter, fileUploadLimiter, aiLimiter, createRateLimiter } from './rateLimiter';
export { errorHandler, asyncHandler, notFoundHandler } from './errorHandler';
export { requestId, requestLogger } from './requestLogger';
export { corsOptions, helmetConfig, compressionConfig } from './security';
export { singleFileUpload, multipleFilesUpload, fieldsUpload, handleUploadError } from './upload';
export { 
  initializePassport, 
  authenticateGoogle, 
  authenticateGitHub, 
  googleCallback, 
  gitHubCallback, 
  handleOAuthSuccess, 
  handleOAuthError 
} from './oauthMiddleware';

// Export aliases for commonly used middleware
export { fileUploadLimiter as uploadLimiter } from './rateLimiter';
