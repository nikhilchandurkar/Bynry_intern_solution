import express from 'express';
import { sequelize } from './config.js';
import productRoutes from "./routes/productRoutes.js"
import alertRoutes from "./routes/alertRoutes.js"
const app = express();
app.use(express.json());

// Routes
app.use(productRoutes);
app.use(alertRoutes);

// Init DB and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
});
