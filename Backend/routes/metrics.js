import express from 'express';
import { getWorkerMetrics,getWorkstationMetrics,getFactoryMetrics } from '../services/metricsService.js';

const router = express.Router();

router.get('/workers', (req, res) => {
  const data = getWorkerMetrics();
  res.json(data);
});
router.get('/workstations', (req, res) => {
  res.json(getWorkstationMetrics());
});
router.get('/factory', (req, res) => {
  res.json(getFactoryMetrics());
});

export default router;