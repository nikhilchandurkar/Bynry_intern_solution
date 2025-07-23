import { Sequelize } from 'sequelize';
import { Product } from '../models/product.js';
import { Inventory } from '../models/inventory.js';
import { Warehouse } from '../models/warehouse.js';
import { Supplier } from '../models/supplier.js';
import { ProductSupplier } from '../models/productSupplier.js';
import { Sale } from '../models/sale.js';

export async function getLowStockAlerts(req, res) {
  const { companyId } = req.params;
  const recentDays = 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - recentDays);

  try {
    // Step 1: Products with recent sales
    const saleProducts = await Sale.findAll({
      where: { saleDate: { [Sequelize.Op.gte]: cutoff } },
      include: { model: Warehouse, where: { companyId } },
      attributes: ['productId'],
      group: ['productId']
    });

    const productIds = saleProducts.map(s => s.productId);

    // Step 2: Inventory for low stock
    const lowStock = await Inventory.findAll({
      where: {
        productId: productIds.length > 0 ? productIds : [-1]
      },
      include: [
        { model: Product, required: true },
        { model: Warehouse, where: { companyId }, required: true }
      ]
    });

    const alerts = [];

    for (let inv of lowStock) {
      const threshold = inv.Product.threshold;
      if (inv.quantity < threshold) {
        const saleCount = await Sale.count({
          where: {
            productId: inv.productId,
            saleDate: { [Sequelize.Op.gte]: cutoff }
          }
        });

        const avgPerDay = saleCount / recentDays || 0;
        const daysUntilStockout = avgPerDay > 0 ? Math.floor(inv.quantity / avgPerDay) : null;

        const supplier = await ProductSupplier.findOne({
          where: { productId: inv.productId },
          include: [Supplier]
        });

        alerts.push({
          product_id: inv.Product.id,
          product_name: inv.Product.name,
          sku: inv.Product.sku,
          warehouse_id: inv.Warehouse.id,
          warehouse_name: inv.Warehouse.name,
          current_stock: inv.quantity,
          threshold,
          days_until_stockout: daysUntilStockout,
          supplier: supplier ? {
            id: supplier.Supplier.id,
            name: supplier.Supplier.name,
            contact_email: supplier.Supplier.contact_email
          } : null
        });
      }
    }

    res.json({ alerts, total_alerts: alerts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
