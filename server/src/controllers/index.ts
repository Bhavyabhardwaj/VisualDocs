import { AuthController } from './authController';
import { ProjectController } from './projectController';
import { AnalysisController } from './analysisController';
import { DiagramController } from './diagramController';
import { teamController } from './teamController';
import { activityController } from './activityController';
import { paymentController } from './paymentController';

// Create controller instances
export const authController = new AuthController();
export const projectController = new ProjectController();
export const analysisController = new AnalysisController();
export const diagramController = new DiagramController();

// Export controller classes
export { AuthController } from './authController';
export { ProjectController } from './projectController';
export { AnalysisController } from './analysisController';
export { DiagramController } from './diagramController';
export { teamController } from './teamController';
export { activityController } from './activityController';
export { paymentController } from './paymentController';

// Export default object for easy importing
export default {
  auth: authController,
  project: projectController,
  analysis: analysisController,
  diagram: diagramController,
  team: teamController,
  activity: activityController,
};
