import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';

export const ProductSupplier = sequelize.define('ProductSupplier', {
  productId: {
    type: DataTypes.INTEGER,
    references: { model: 'Products', key: 'id' }
  },
  supplierId: {
    type: DataTypes.INTEGER,
    references: { model: 'Suppliers', key: 'id' }
  }
});
