import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { createUserSchema, loginUserSchema } from '../../application/dto/UserDTO.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', validate(createUserSchema), userController.register);
router.post('/login', validate(loginUserSchema), userController.login);
router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, userController.updateMe);

export default router;