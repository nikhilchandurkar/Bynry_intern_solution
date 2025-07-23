import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';

export const Warehouse = sequelize.define('Warehouse', {
  name: { type: DataTypes.STRING, allowNull: false },
  companyId: { type: DataTypes.INTEGER, allowNull: false }
});
