import { CustomError } from "../utils/customError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  // Handle Sequelize validation errors
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ errors: messages });
  }

  // Handle other Sequelize errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
};
