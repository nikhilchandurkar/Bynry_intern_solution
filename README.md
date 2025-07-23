# 📦 StockFlow – Inventory Management System (Backend Engineering Case Study)

This repository contains two backend implementations of the StockFlow B2B Inventory Management System:

- Python (Flask) implementation in `py_backend/`
-  Node.js (Express.js) implementation in `node_backend/`

---

##  Features Implemented in Both Versions

- Product creation API with unique SKU check
- Initial inventory setup per warehouse
- Low-stock alerts based on product threshold
- Sales tracking to calculate days until stockout
- Supplier details included in alerts

---

##  Python Flask App (`py_backend/`)

###  Tech Stack

- Python 3.10+
- Flask
- SQLAlchemy
- SQLite

### for flask / python
###  Setup & Run

bash
cd py_backend

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py


# for js 
cd node_backend

# Install packages
npm install

# Manually install SQLite driver
npm install sqlite3

# Start the app
npm start

 
### sample post request 


POST /api/products
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "sku": "MSE-WL-001",
  "price": 49.99,
  "warehouseId": 1,
  "initialQuantity": 20
}

# get request 
GET /api/companies/1/alerts/low-stock
