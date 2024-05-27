import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js';
import { createProject, updateProject, deleteProject, getProjects, getProjectById } from '../controllers/projectController.js';
import { authorize, validateProjectRoles } from '../middlewares/roleMiddleware.js';

const projectRouter = express.Router();

projectRouter.post('/', authenticate, authorize(['SuperAdmin', 'Admin']), validateProjectRoles, createProject);
projectRouter.put('/:id', authenticate, authorize(['SuperAdmin', 'Admin']), validateProjectRoles, updateProject);
projectRouter.delete('/:id', authenticate, authorize(['SuperAdmin']), deleteProject);
projectRouter.get('/', authenticate, getProjects);
projectRouter.get('/:id', authenticate, getProjectById);

export default projectRouter;