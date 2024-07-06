import buildProLogger from './prodLogger.js';
import buildDevLogger from './devLogger.js';
import customEnv from '../config/customEnv.js';

let logger = null;
if (customEnv.nodeEnv === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProLogger();
}

export default logger;
