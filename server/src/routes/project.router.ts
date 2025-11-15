import { Router } from 'express';
import { projectController } from '../controllers';
import { validate } from '../validations';
import { 
  createProjectSchema, 
  updateProjectSchema,
  getProjectSchema,
  paginationSchema,
  githubImportSchema,
  githubValidationSchema,
  githubRepoInfoSchema
} from '../validations';
import { 
  generalLimiter,
  uploadLimiter,
  aiLimiter,
  checkProjectLimit
} from '../middleware';
import { multipleFilesUpload, handleUploadError } from '../middleware/upload';

const router = Router();

// All project routes require authentication (applied in main router)

// Project CRUD
router.post('/', 
  generalLimiter,
  checkProjectLimit, // Check if user can create more projects
  validate(createProjectSchema),
  projectController.createProject
);

router.get('/', 
  validate(paginationSchema),
  projectController.getProjects
);

router.get('/:id', 
  validate(getProjectSchema),
  projectController.getProject
);

router.put('/:id', 
  generalLimiter,
  validate(updateProjectSchema),
  projectController.updateProject
);

router.delete('/:id', 
  validate(getProjectSchema),
  projectController.deleteProject
);

// Project actions
router.patch('/:id/archive', 
  validate(getProjectSchema),
  projectController.toggleArchive
);

router.get('/:id/stats', 
  validate(getProjectSchema),
  projectController.getProjectStatistics
);

// File management
router.post('/:id/files', 
  uploadLimiter,
  validate(getProjectSchema),
  multipleFilesUpload,
  handleUploadError,
  projectController.uploadFiles
);

router.get('/:id/files', 
  validate(getProjectSchema),
  projectController.getProjectFiles
);

router.put('/:id/files/:fileId', 
  validate(getProjectSchema),
  projectController.updateFile
);

// Collaboration (future feature)
router.get('/:id/collaborators', 
  validate(getProjectSchema),
  projectController.getCollaborators
);

// GitHub integration routes
router.post('/import/github', 
  generalLimiter,
  validate(githubImportSchema),
  projectController.importFromGitHub
);

router.post('/validate/github', 
  generalLimiter,
  validate(githubValidationSchema),
  projectController.validateGitHubRepository
);

router.get('/github/info', 
  validate(githubRepoInfoSchema),
  projectController.getGitHubRepositoryInfo
);

export default router;
