import { Router } from 'express';
import { StockMovementController } from '../controllers/stock-movement.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
const controller = new StockMovementController();

router.use(authenticate);
router.get('/', asyncHandler(controller.list.bind(controller)));

export default router;

