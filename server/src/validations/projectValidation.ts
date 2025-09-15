import { z } from 'zod';

// Create project schema
export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .max(100, 'Project name cannot exceed 100 characters')
      .trim(),
    description: z
      .string()
      .max(500, 'Description cannot exceed 500 characters')
      .trim()
      .optional(),
      // by using enum user can only select one of the predefined languages else it will throw an error
    language: z
      .enum(['typescript', 'javascript', 'python', 'java', 'csharp', 'cpp'], {
        message: 'Invalid programming language'
      }),
    framework: z
      .string()
      .max(50, 'Framework name cannot exceed 50 characters')
      .trim()
      .optional(),
    visibility: z
      .enum(['PRIVATE', 'PUBLIC', 'TEAM'], {
        message: 'Invalid visibility option'
      })
      .optional()
      .default('PRIVATE'),
  }),
});

// Update project schema
export const updateProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .max(100, 'Project name cannot exceed 100 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, 'Description cannot exceed 500 characters')
      .trim()
      .optional(),
    status: z
      .enum(['ACTIVE', 'ARCHIVED', 'DELETED'], { 
        message: 'Invalid project status'
      })
      .optional(),
    visibility: z
      .enum(['PRIVATE', 'PUBLIC', 'TEAM'], {
        message: 'Invalid visibility option'
      })
      .optional(),
  }),
  params: z.object({
    id: z
      .string()
      .uuid('Invalid project ID format'),
  }),
});

// Get project by ID schema
export const getProjectSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid('Invalid project ID format'),
  }),
});

// Pagination schema
export const paginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .transform(val => parseInt(val))
      .refine(val => val > 0, 'Page must be greater than 0')
      .optional()
      .default(1),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .transform(val => parseInt(val))
      .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
      .optional()
      .default(10),
    sort: z
      .enum(['createdAt', 'updatedAt', 'name', 'status'])
      .optional()
      .default('createdAt'),
    order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc'),
  }),
});
