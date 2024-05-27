import User from '../models/user.js';
import { logger } from '../utils/logger.js';
import { getCache, setCache } from '../utils/redis.js';

// View all users (SuperAdmin only)
export const getAllUsers = async (req, res, next) => {
    try {
        const cached_users = await getCache('users');
        if (cached_users) return res.json(cached_users);
        const users = await User.findAll();
        logger.info(`All users retrieved by user: ${req.user.id}`);
        setCache('users', users);
        res.json(users);
    } catch (err) {
        next(err);
    }
};