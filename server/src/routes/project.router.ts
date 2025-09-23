import { Router } from 'express';
import { projectController } from '../controllers';
import { validate } from '../validations';
import { 
  createProjectSchema, 
  updateProjectSchema,
  getProjectSchema,
  paginationSchema
} from '../validations';
import { 
  generalLimiter,
  uploadLimiter,
  multipleFilesUpload,
  handleUploadError
} from '../middleware';

const router = Router();

// All project routes require authentication (applied in main router)

// Project CRUD
router.post('/', 
  generalLimiter,
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

// Collaboration (future feature)
router.get('/:id/collaborators', 
  validate(getProjectSchema),
  projectController.getCollaborators
);

export default router;
