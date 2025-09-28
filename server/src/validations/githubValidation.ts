import { z } from 'zod';

// GitHub URL validation regex
const githubUrlRegex = /^https?:\/\/github\.com\/[^\/]+\/[^\/]+(?:\.git)?(?:\/.*)?$|^git@github\.com:[^\/]+\/[^\/]+(?:\.git)?$|^[^\/]+\/[^\/]+$/;

export const githubImportSchema = z.object({
  body: z.object({
    githubUrl: z.string({
      message: 'GitHub URL is required'
    }).min(1, 'GitHub URL cannot be empty')
      .refine((url) => githubUrlRegex.test(url), {
        message: 'Invalid GitHub URL format. Expected: https://github.com/owner/repo'
      }),
    
    branch: z.string()
      .min(1, 'Branch name cannot be empty')
      .optional()
      .default('main'),
    
    includeTests: z.boolean()
      .optional()
      .default(false),
    
    maxFileSizeMB: z.number()
      .min(0.1, 'Maximum file size must be at least 0.1MB')
      .max(50, 'Maximum file size cannot exceed 50MB')
      .optional()
      .default(5),
    
    fileExtensions: z.array(z.string())
      .optional(),
    
    // Project details for the imported project
    projectName: z.string()
      .min(1, 'Project name is required')
      .max(100, 'Project name cannot exceed 100 characters')
      .optional(), // If not provided, will use repo name
    
    projectDescription: z.string()
      .max(500, 'Project description cannot exceed 500 characters')
      .optional(),
    
    visibility: z.enum(['PRIVATE', 'PUBLIC', 'TEAM'])
      .optional()
      .default('PRIVATE')
  })
});

export const githubValidationSchema = z.object({
  body: z.object({
    githubUrl: z.string({
      message: 'GitHub URL is required'
    }).min(1, 'GitHub URL cannot be empty')
      .refine((url) => githubUrlRegex.test(url), {
        message: 'Invalid GitHub URL format. Expected: https://github.com/owner/repo'
      })
  })
});

export const githubRepoInfoSchema = z.object({
  query: z.object({
    url: z.string({
      message: 'GitHub URL is required'
    }).min(1, 'GitHub URL cannot be empty')
      .refine((url) => githubUrlRegex.test(url), {
        message: 'Invalid GitHub URL format. Expected: https://github.com/owner/repo'
      }),
    
    branch: z.string()
      .min(1, 'Branch name cannot be empty')
      .optional()
  })
});

// Type exports
export type GitHubImportRequest = z.infer<typeof githubImportSchema>['body'];
export type GitHubValidationRequest = z.infer<typeof githubValidationSchema>['body'];
export type GitHubRepoInfoRequest = z.infer<typeof githubRepoInfoSchema>['query'];