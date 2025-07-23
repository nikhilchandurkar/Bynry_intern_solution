import express from 'express';
import { getLowStockAlerts } from '../controllers/alertController.js';

const router = express.Router();
router.get('/api/companies/:companyId/alerts/low-stock', getLowStockAlerts);
export default router;
