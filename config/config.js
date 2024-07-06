import { config } from 'dotenv';
config();

export default {
  development: {
    username: 'postgres',
    password: process.env.MYSQL_PASSWORD,
    database: 'hng-stage2task',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: process.env.MYSQL_PASSWORD,
    database: 'hng-stage2task',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: 'postgres',
    password: process.env.MYSQL_PASSWORD,
    database: 'hng-stage2task',
    host: 'localhost',
    dialect: 'postgres',
  },
};
