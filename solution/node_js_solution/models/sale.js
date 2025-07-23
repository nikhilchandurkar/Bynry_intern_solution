import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';

export const Sale = sequelize.define('Sale', {
  productId: { type: DataTypes.INTEGER, allowNull: false },
  warehouseId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  saleDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
