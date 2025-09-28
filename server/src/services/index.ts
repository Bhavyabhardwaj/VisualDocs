import { AuthService } from "./authService";
import { ProjectService } from "./projectService";
import { eventService } from "./eventService";
import { AnalysisService } from "./analysisService";
import { DiagramService } from "./diagramService";
import { GitHubService } from "./githubService";

export const authService = new AuthService();
export const projectService = new ProjectService();
export { eventService };
export const analysisService = new AnalysisService();
export const diagramService = new DiagramService();
export const githubService = new GitHubService();


export { AuthService } from './authService';
export { ProjectService } from './projectService';
export { AnalysisService } from './analysisService';
export { DiagramService } from './diagramService';
export { GitHubService } from './githubService';

export default {
    auth: authService,
    project: projectService,
    analysis: analysisService,
    diagram: diagramService,
    github: githubService,
};