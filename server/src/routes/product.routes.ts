import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { adjustStockSchema, productQuerySchema, productSchema, updateProductSchema } from '../models/product.js';

const router = Router();
const controller = new ProductController();

router.use(authenticate);
router.get('/', validateQuery(productQuerySchema), asyncHandler(controller.list.bind(controller)));
router.post('/', authorize(['ADMIN']), validateBody(productSchema), asyncHandler(controller.create.bind(controller)));
router.put('/:id', authorize(['ADMIN']), validateBody(updateProductSchema), asyncHandler(controller.update.bind(controller)));
router.post(
  '/:id/adjust-stock',
  authorize(['ADMIN', 'WAREHOUSE']),
  validateBody(adjustStockSchema),
  asyncHandler(controller.adjustStock.bind(controller))
);

export default router;

