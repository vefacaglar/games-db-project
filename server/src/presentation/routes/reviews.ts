import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { createReviewSchema, updateReviewSchema } from '../../application/dto/ReviewDTO.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/game/:gameId', optionalAuth, reviewController.getGameReviewsHandler);
router.get('/my', authenticate, reviewController.getMyReviewsHandler);
router.post('/', authenticate, validate(createReviewSchema), reviewController.create);
router.put('/:id', authenticate, validate(updateReviewSchema), reviewController.update);
router.delete('/:id', authenticate, reviewController.remove);

export default router;