import { AuthController } from './authController';
import { ProjectController } from './projectController';
import { AnalysisController } from './analysisController';
import { DiagramController } from './diagramController';

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

// Export default object for easy importing
export default {
  auth: authController,
  project: projectController,
  analysis: analysisController,
  diagram: diagramController,
};
