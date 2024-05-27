import User from "../models/user.js";
import { CustomError } from "../utils/customError.js";

// Middleware to authorize user based on role
export const authorize = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new CustomError(403, 'Access denied.');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateProjectRoles = async (req, res, next) => {
  try {
    const { project_manager_id, client_id } = req.body;
    if (!project_manager_id && !client_id) {
      next();
      return;
    }
    // Check if the project_manager is either a SuperAdmin or Admin
    const projectManager = await User.findByPk(project_manager_id);
    if (!projectManager || !['SuperAdmin', 'Admin'].includes(projectManager.role)) {
      throw new CustomError(400, 'Project manager must be a SuperAdmin or Admin');
    }

    // Check if the client_id is of Client role only
    const client = await User.findByPk(client_id);
    if (!client || client.role !== 'Client') {
      throw new CustomError(400, 'Client ID must belong to a Client role');
    }

    next();
  } catch (err) {
    next(err);
  }
};
