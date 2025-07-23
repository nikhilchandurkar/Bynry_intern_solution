-- ============================================
-- ✅ BACKEND ENGINEERING INTERN CASE STUDY
-- PART 2: DATABASE DESIGN – StockFlow
-- ============================================

-- ============================================
-- 🏢 1. COMPANIES
-- A company owns warehouses and manages products
-- ============================================

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100)
);

-- ============================================
-- 📦 2. WAREHOUSES
-- A warehouse belongs to a company
-- ============================================

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255)
);

-- ============================================
-- 📄 3. PRODUCTS
-- Products can be stored in multiple warehouses
-- ============================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL, -- must be globally unique
    price DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) DEFAULT 'single', -- 'single' or 'bundle'
    threshold INTEGER DEFAULT 0 -- low stock alert threshold
);

-- ============================================
-- 🧃 4. INVENTORY
-- Tracks quantity of a product in a warehouse
-- ============================================

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, warehouse_id)
);

-- ============================================
-- 🧾 5. INVENTORY HISTORY
-- Tracks stock changes over time
-- ============================================

CREATE TABLE inventory_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quantity_change INTEGER NOT NULL,
    change_reason VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 🏷️ 6. SUPPLIERS
-- Supplier information
-- ============================================

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255)
);

-- ============================================
-- 🔗 7. PRODUCT-SUPPLIER RELATIONSHIP
-- Many-to-many between products and suppliers
-- ============================================

CREATE TABLE product_suppliers (
    product_id INTEGER NOT NULL REFERENCES products(id),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    PRIMARY KEY (product_id, supplier_id)
);

-- ============================================
-- 📦 8. PRODUCT BUNDLES
-- Self-referencing many-to-many relationship
-- ============================================

CREATE TABLE product_bundles (
    bundle_id INTEGER NOT NULL REFERENCES products(id),
    item_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (bundle_id, item_id)
);

-- ============================================
-- 💰 9. SALES
-- Tracks product sales to compute stockout risk
-- ============================================

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ❓ BUSINESS QUESTIONS / ASSUMPTIONS
-- ============================================

-- 1. Should bundled product stock depend on child item availability?
-- 2. Should we track product batch numbers or expiry dates?
-- 3. Can a product belong to multiple companies or is it global?
-- 4. Do suppliers have lead times or multiple prices per product?
-- 5. Should soft-deletes be implemented for logical deletions?
-- 6. Will access control (multi-user per company) be required?
-- 7. Should units (kg, liters) be stored with inventory?
-- 8. Do we need internationalization (currencies, languages)?
