import { AuthService } from "./authService";
import { ProjectService } from "./projectService";
import { EventService } from "./eventService";
import { AnalysisService } from "./analysisService";

export const authService = new AuthService();
export const projectService = new ProjectService();
export const eventService = new EventService();
export const analysisService = new AnalysisService();


export { AuthService } from './authService';
export { ProjectService } from './projectService';
export { EventService } from './eventService';
export { AnalysisService } from './analysisService';

export default {
    auth: authService,
    project: projectService,
    event: eventService,
    analysis: analysisService,
};