import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';

export const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  threshold: { type: DataTypes.INTEGER, defaultValue: 10 }
});
