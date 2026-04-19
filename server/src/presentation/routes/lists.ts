import { Router } from 'express';
import * as listController from '../controllers/listController.js';
import { authenticate } from '../middleware/auth.js';
import { createListSchema, updateListSchema } from '../../application/dto/ListDTO.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticate, listController.getMyLists);
router.get('/:id', authenticate, listController.getById);
router.post('/', authenticate, validate(createListSchema), listController.create);
router.put('/:id', authenticate, validate(updateListSchema), listController.update);
router.delete('/:id', authenticate, listController.remove);
router.post('/:id/games', authenticate, listController.addGame);
router.delete('/:id/games', authenticate, listController.removeGame);

export default router;