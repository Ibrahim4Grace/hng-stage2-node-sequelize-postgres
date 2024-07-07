import { config } from 'dotenv';
config();

// export default {
//   development: {
//     username: 'postgres',
//     password: process.env.MYSQL_PASSWORD,
//     database: 'hng-stage2task',
//     host: 'localhost',
//     dialect: 'postgres',
//   },
//   test: {
//     username: 'postgres',
//     password: process.env.MYSQL_PASSWORD,
//     database: 'hng-stage2task',
//     host: 'localhost',
//     dialect: 'postgres',
//   },
//   production: {
//     username: 'postgres',
//     password: process.env.MYSQL_PASSWORD,
//     database: 'hng-stage2task',
//     host: 'localhost',
//     dialect: 'postgres',
//   },
// };

export default {
  development: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
};
