import dotenv from 'dotenv';

dotenv.config();

const customEnv = {
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USERNAME,
  mysqlDb: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  dialect: process.env.POSTGRES_DIALECT,
  nodeEnv: process.env.NODE_ENV || 'development',

  jwtSecret: process.env.JWT_SECRET,

  userAccessTokenExpireTime: process.env.USER_ACCESS_TOKEN_EXPIRATION_TIME,
};

export default customEnv;
