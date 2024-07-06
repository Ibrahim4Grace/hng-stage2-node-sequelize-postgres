import { Sequelize } from 'sequelize';
import customEnv from '../config/customEnv.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  customEnv.mysqlDb,
  customEnv.username,
  customEnv.password,
  {
    host: customEnv.host,
    dialect: customEnv.dialect,
  }
);

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDb };
