import { Product } from '../models/product.js';
import { Warehouse } from '../models/warehouse.js';
import { Inventory } from '../models/inventory.js';

export async function createProduct(req, res) {
  try {
    const { name, sku, price, warehouseId, initialQuantity } = req.body;

    if (!name || !sku || !price || !warehouseId || !initialQuantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await Product.findOne({ where: { sku } });
    if (existing) return res.status(409).json({ error: 'SKU already exists' });

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

    const product = await Product.create({ name, sku, price });

    await Inventory.create({
      productId: product.id,
      warehouseId,
      quantity: initialQuantity
    });

    res.status(201).json({ message: 'Product created', productId: product.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
