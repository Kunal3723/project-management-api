import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
// Create Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST, // Remote Redis server's host
    port: process.env.REDIS_PORT, // Remote Redis server's port
    password: process.env.REDIS_PASSWORD // If your Redis server requires a password
});

export const setCache = (key, data) => {
    try {
        redisClient.setex(key, 3600, JSON.stringify(data)); // Set cache with expiry time (e.g., 1 hour)
    } catch (error) {

    }
};

export const getCache = async (key) => {
    try {
        let res = await redisClient.get(key);
        res = JSON.parse(res);
        return res;
    } catch (error) {
        return null;
    }
};

export const clearCache = async (key) => {
    try {
        let res = await redisClient.get(key);
        if (res) {
            redisClient.del(key);
        }
    } catch (error) {

    }
}

export const deleteKeysByPrefix = async (prefix) => {
    console.log(prefix);
    const scanAsync = (cursor) => {
        return new Promise((resolve, reject) => {
            redisClient.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', '100', (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    };

    let cursor = '0';
    do {
        const result = await scanAsync(cursor);
        cursor = result[0];
        const keys = result[1];
        if (keys.length > 0) {
            redisClient.del(keys, (err, response) => {
                if (err) {
                    console.error('Error deleting keys:', err);
                } else {
                    console.log('Deleted keys:', keys);
                }
            });
        }
    } while (cursor !== '0');
};
