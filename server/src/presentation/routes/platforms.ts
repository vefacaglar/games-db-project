import { Router } from 'express';
import * as platformController from '../controllers/platformController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', platformController.getAll);
router.post('/', authenticate, platformController.create);
router.delete('/:id', authenticate, platformController.remove);

export default router;