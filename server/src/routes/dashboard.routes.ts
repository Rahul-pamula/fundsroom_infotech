import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
const controller = new DashboardController();

router.use(authenticate);
router.get('/summary', asyncHandler(controller.summary.bind(controller)));

export default router;

