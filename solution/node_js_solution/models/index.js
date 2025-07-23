import { Sequelize } from 'sequelize';
import { sequelize } from '../config.js';

import { Product } from './product.js';
import { Warehouse } from './warehouse.js';
import { Inventory } from './inventory.js';
import { Supplier } from './supplier.js';
import { ProductSupplier } from './productSupplier.js';
import { Sale } from './sale.js';

// Define associations
Product.hasMany(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product);

Warehouse.hasMany(Inventory, { foreignKey: 'warehouseId' });
Inventory.belongsTo(Warehouse);

Product.belongsToMany(Supplier, { through: ProductSupplier, foreignKey: 'productId' });
Supplier.belongsToMany(Product, { through: ProductSupplier, foreignKey: 'supplierId' });

Warehouse.hasMany(Sale, { foreignKey: 'warehouseId' });
Product.hasMany(Sale, { foreignKey: 'productId' });

export {
  sequelize,
  Product,
  Warehouse,
  Inventory,
  Supplier,
  ProductSupplier,
  Sale
};
