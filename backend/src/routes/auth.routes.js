import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { csrfProtection } from '../middlewares/csrf.js';
import { loginLimiter } from '../middlewares/rateLimiters.js';
import { validate } from '../middlewares/validateRequest.js';
import { loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.get('/me', authController.me);
router.post('/logout', csrfProtection, authController.logout);

export default router;
