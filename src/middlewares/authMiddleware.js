import jwt from 'jsonwebtoken'
import User from '../models/user.js';
import { CustomError } from '../utils/customError.js';
import { logger } from '../utils/logger.js';
const { JWT_SECRET } = process.env;

// Middleware to authenticate user using JWT
export const authenticate = async (req, res, next) => {
  try {
    if (req.user) {
      next();
      return;
    }
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      logger.info(`Authentication failed: No token provided. IP: ${req.ip}`);
      throw new CustomError(401, 'Access denied. No token provided.');
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      throw new CustomError(401, 'Invalid token.');
    }
    logger.info(`Authentication successful: User ${decoded.id} authenticated. IP: ${req.ip}`);
    next();
  } catch (ex) {
    next(new CustomError(400, 'invalid token'))
  }
};
