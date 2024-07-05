import buildProLogger from './prodLogger';
import buildDevLogger from './devLogger';
import customEnv from '../src/config/customEnv';

let logger = null;
if (customEnv.nodeEnv === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProLogger();
}

export default logger;
