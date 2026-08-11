import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { createFollowupSchema, customerQuerySchema, customerSchema, updateCustomerSchema } from '../models/customer.js';

const router = Router();
const controller = new CustomerController();

router.use(authenticate);
router.get('/', validateQuery(customerQuerySchema), asyncHandler(controller.list.bind(controller)));
router.post('/', authorize(['ADMIN', 'SALES']), validateBody(customerSchema), asyncHandler(controller.create.bind(controller)));
router.get('/:id', asyncHandler(controller.getById.bind(controller)));
router.put('/:id', authorize(['ADMIN', 'SALES']), validateBody(updateCustomerSchema), asyncHandler(controller.update.bind(controller)));
router.post(
  '/:id/followups',
  authorize(['ADMIN', 'SALES']),
  validateBody(createFollowupSchema),
  asyncHandler(controller.addFollowup.bind(controller))
);

export default router;

