import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../models/auth.js';

const router = Router();
const controller = new AuthController();

router.post('/login', validateBody(loginSchema), asyncHandler(controller.login.bind(controller)));
router.post('/signup', validateBody(signupSchema), asyncHandler(controller.signup.bind(controller)));

export default router;
