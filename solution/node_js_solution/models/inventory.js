import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';

export const Inventory = sequelize.define('Inventory', {
  productId: { type: DataTypes.INTEGER, allowNull: false },
  warehouseId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false }
});
