// config.js
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data.sqlite', // or ':memory:' for in-memory DB
  logging: false
});
