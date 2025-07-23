from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from sqlalchemy import func
from .models import db, Product, Warehouse, Inventory, Supplier, ProductSupplier, Sale

alert_bp = Blueprint('alert_bp', __name__)

@alert_bp.route('/api/companies/<int:company_id>/alerts/low-stock', methods=['GET'])
def low_stock_alerts(company_id):
    try:
        recent_days = 30
        cutoff_date = datetime.utcnow() - timedelta(days=recent_days)

        recent_sales_products = (
            db.session.query(Sale.product_id)
            .join(Warehouse, Sale.warehouse_id == Warehouse.id)
            .filter(Warehouse.company_id == company_id)
            .filter(Sale.sale_date >= cutoff_date)
            .distinct()
            .all()
        )
        product_ids = [row.product_id for row in recent_sales_products]

        if not product_ids:
            return jsonify({"alerts": [], "total_alerts": 0}), 200

        inventory_data = (
            db.session.query(
                Product.id.label("product_id"),
                Product.name.label("product_name"),
                Product.sku,
                Warehouse.id.label("warehouse_id"),
                Warehouse.name.label("warehouse_name"),
                func.sum(Inventory.quantity).label("current_stock"),
                Product.threshold
            )
            .join(Inventory, Inventory.product_id == Product.id)
            .join(Warehouse, Inventory.warehouse_id == Warehouse.id)
            .filter(Warehouse.company_id == company_id)
            .filter(Product.id.in_(product_ids))
            .group_by(Product.id, Warehouse.id)
            .having(func.sum(Inventory.quantity) < Product.threshold)
            .all()
        )

        alerts = []

        for row in inventory_data:
            avg_daily_sales = (
                db.session.query(func.count(Sale.id) / recent_days)
                .filter(Sale.product_id == row.product_id)
                .filter(Sale.sale_date >= cutoff_date)
                .scalar()
            )
            days_until_stockout = int(row.current_stock / avg_daily_sales) if avg_daily_sales and avg_daily_sales > 0 else None

            supplier = (
                db.session.query(Supplier)
                .join(ProductSupplier, Supplier.id == ProductSupplier.supplier_id)
                .filter(ProductSupplier.product_id == row.product_id)
                .first()
            )

            alerts.append({
                "product_id": row.product_id,
                "product_name": row.product_name,
                "sku": row.sku,
                "warehouse_id": row.warehouse_id,
                "warehouse_name": row.warehouse_name,
                "current_stock": int(row.current_stock),
                "threshold": row.threshold,
                "days_until_stockout": days_until_stockout,
                "supplier": {
                    "id": supplier.id if supplier else None,
                    "name": supplier.name if supplier else None,
                    "contact_email": supplier.contact_email if supplier else None
                }
            })

        return jsonify({
            "alerts": alerts,
            "total_alerts": len(alerts)
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
