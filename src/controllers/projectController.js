import Project from "../models/project.js";
import { validateProject } from "../utils/validator.js";
import AuditLog from "../models/auditLog.js";
import { CustomError } from "../utils/customError.js";
import { logger } from '../utils/logger.js';
import { clearCache, deleteKeysByPrefix, getCache, setCache } from "../utils/redis.js";
import { generateCachedKey } from "../utils/helperFunctions.js";

// Create a new project
export const createProject = async (req, res, next) => {
  try {
    const { error } = validateProject(req.body);
    if (error) {
      throw new CustomError(400, error.message);
    }

    const project = await Project.create(req.body);
    await clearCache('projects');
    const key = generateCachedKey({ role: 'Client', id: req.body.id, client_id: req.body.client_id }, 'projects');
    await deleteKeysByPrefix(key);
    await AuditLog.create({
      user_id: req.user.id,
      action: 'CREATE',
      entity: 'Project',
      entity_id: project.id,
      timestamp: new Date(),
    });

    logger.info(`Project created: ${project.id} by user: ${req.user.id}`);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// Update an existing project
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const old_client_id = project.client_id;
    if (!project) throw new CustomError(404, 'Project not found');

    await project.update(req.body);

    await AuditLog.create({
      user_id: req.user.id,
      action: 'UPDATE',
      entity: 'Project',
      entity_id: project.id,
      timestamp: new Date(),
    });

    const new_client_id = req.body.client_id || null;
    await clearCache('projects');
    if (new_client_id) {
      await deleteKeysByPrefix(generateCachedKey({ role: 'Client', id: project.id, client_id: new_client_id }, 'projects'));
    }
    await deleteKeysByPrefix(generateCachedKey({ role: 'Client', id: project.id, client_id: old_client_id }, 'projects'));
    await clearCache(generateCachedKey({ role: 'Client', id: project.id, client_id: old_client_id }, 'project'));
    await clearCache(generateCachedKey({ role: req.user.role, client_id: req.user.id, id: project.id }, 'project'));

    logger.info(`Project updated: ${project.id} by user: ${req.user.id}`);
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Soft delete a project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const old_client_id = project.client_id;
    if (!project) throw new CustomError(404, 'Project not found');

    await project.update({ isDeleted: true });

    await AuditLog.create({
      user_id: req.user.id,
      action: 'DELETE',
      entity: 'Project',
      entity_id: project.id,
      timestamp: new Date(),
    });

    const new_client_id = req.body.client_id || null;
    await clearCache('projects');
    if (new_client_id) {
      await deleteKeysByPrefix(generateCachedKey({ role: 'Client', id: project.id, client_id: new_client_id }, 'projects'));
    }
    await deleteKeysByPrefix(generateCachedKey({ role: 'Client', id: project.id, client_id: old_client_id }, 'projects'));
    await clearCache(generateCachedKey({ role: 'Client', id: project.id, client_id: old_client_id }, 'project'));
    await clearCache(generateCachedKey({ role: req.user.role, client_id: req.user.id, id: project.id }, 'project'));

    logger.info(`Project deleted: ${project.id} by user: ${req.user.id}`);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// View all projects with pagination and sorting
export const getProjects = async (req, res, next) => {
  try {
    const { page = 1, size = 10, sort = 'createdAt', order = 'ASC' } = req.query;
    const limit = parseInt(size);
    const offset = (page - 1) * limit;
    const condition = req.user.role !== 'Client' ? {
      isDeleted: false,
    } : {
      isDeleted: false,
      client_id: req.user.id
    };

    const key = generateCachedKey({ role: req.user.role, client_id: req.user.id }, 'projects') + ':' + page + ':' + size + ':' + sort + ':' + order;
    let projects = await getCache(key);
    if (!projects) {
      projects = await Project.findAndCountAll({
        limit,
        offset,
        order: [[sort, order.toUpperCase()]],
        where: condition,
      });
      setCache(key, projects);
    }

    logger.info(`Projects retrieved by user: ${req.user.id}`);
    res.json({
      totalItems: projects.count,
      totalPages: Math.ceil(projects.count / limit),
      currentPage: page,
      projects: projects.rows,
    });
  } catch (err) {
    next(err);
  }
};

// View a specific project
export const getProjectById = async (req, res, next) => {
  try {
    const condition = req.user.role !== 'Client' ? {
      id: req.params.id,
      isDeleted: false,
    } : {
      id: req.params.id,
      isDeleted: false,
      client_id: req.user.id
    };
    const key = generateCachedKey({ role: req.user.role, client_id: req.user.id, id: req.params.id }, 'project');
    let project = await getCache(key);
    console.log(project);
    if (!project) {
      project = await Project.findOne({
        where: condition
      });
      setCache(key, project);
    }

    if (!project) {
      throw new CustomError(404, 'Project not found');
    }

    logger.info(`Project retrieved: ${project.id} by user: ${req.user.id}`);
    res.json(project);
  } catch (err) {
    next(err);
  }
};
