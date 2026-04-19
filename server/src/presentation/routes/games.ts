import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { createGameSchema, updateGameSchema, gameFiltersSchema } from '../../application/dto/GameDTO.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, gameController.getAll);
router.get('/:id', optionalAuth, gameController.getById);
router.post('/', authenticate, validate(createGameSchema), gameController.create);
router.put('/:id', authenticate, validate(updateGameSchema), gameController.update);
router.delete('/:id', authenticate, gameController.remove);

export default router;