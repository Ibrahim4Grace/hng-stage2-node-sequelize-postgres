import dotenv from 'dotenv';

dotenv.config();

const customEnv = {
  port: process.env.PORT,
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USERNAME,
  mysqlDb: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_BASE_URL
      : process.env.PROD_BASE_URL,

  jwtSecret: process.env.JWT_SECRET,

  userAccessTokenExpireTime: process.env.USER_ACCESS_TOKEN_EXPIRATION_TIME,
};

export default customEnv;
