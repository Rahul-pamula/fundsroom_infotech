import { Router } from 'express';
import { ChallanController } from '../controllers/challan.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { challanQuerySchema, challanSchema, updateDraftChallanSchema } from '../models/challan.js';

const router = Router();
const controller = new ChallanController();

router.use(authenticate);
router.get('/', validateQuery(challanQuerySchema), asyncHandler(controller.list.bind(controller)));
router.post('/', authorize(['ADMIN', 'SALES']), validateBody(challanSchema), asyncHandler(controller.create.bind(controller)));
router.get('/:id', asyncHandler(controller.getById.bind(controller)));
router.put('/:id', authorize(['ADMIN', 'SALES']), validateBody(updateDraftChallanSchema), asyncHandler(controller.updateDraft.bind(controller)));
router.post('/:id/confirm', authorize(['ADMIN', 'SALES', 'WAREHOUSE']), asyncHandler(controller.confirm.bind(controller)));
router.post('/:id/cancel', authorize(['ADMIN', 'SALES']), asyncHandler(controller.cancel.bind(controller)));

export default router;

