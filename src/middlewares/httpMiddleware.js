import morgan from "morgan";
import { httpLogger } from "../utils/logger.js";

export const httpLoggerMiddleware = morgan('combined', {
    stream: {
        write: (message) => httpLogger.info(message.trim())
    }
});