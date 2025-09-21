import { AuthService } from "./authService";
import { ProjectService } from "./projectService";
import { EventService } from "./eventService";

export const authService = new AuthService();
export const projectService = new ProjectService();
export const eventService = new EventService();


export { AuthService } from './authService';
export { ProjectService } from './projectService';
export { EventService } from './eventService';

export default {
    auth: authService,
    project: projectService,
    event: eventService,
};