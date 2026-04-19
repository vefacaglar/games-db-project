import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { createSubmissionSchema, updateSubmissionSchema } from '../../application/dto/ReviewDTO.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/game/:gameId', optionalAuth, reviewController.getGameSubmissionsHandler);
router.get('/my', authenticate, reviewController.getMySubmissionsHandler);
router.get('/pending', authenticate, reviewController.getPendingSubmissionsHandler);

router.post('/', authenticate, validate(createSubmissionSchema), reviewController.create);
router.put('/:id', authenticate, reviewController.update);
router.delete('/:id', authenticate, reviewController.remove);

router.post('/:id/approve', authenticate, reviewController.approve);
router.post('/:id/reject', authenticate, reviewController.reject);

export default router;