import { AuthService } from "./authService";
import { ProjectService } from "./projectService";
import { EventService } from "./eventService";
import { AnalysisService } from "./analysisService";
import { DiagramService } from "./diagramService";

export const authService = new AuthService();
export const projectService = new ProjectService();
export const eventService = new EventService();
export const analysisService = new AnalysisService();
export const diagramService = new DiagramService();


export { AuthService } from './authService';
export { ProjectService } from './projectService';
export { EventService } from './eventService';
export { AnalysisService } from './analysisService';
export { DiagramService } from './diagramService';

export default {
    auth: authService,
    project: projectService,
    event: eventService,
    analysis: analysisService,
    diagram: diagramService,
};