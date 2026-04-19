import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, reviewController.getLibraryHandler);
router.post('/', authenticate, reviewController.addToLibraryHandler);
router.patch('/:id', authenticate, reviewController.updateLibraryHandler);
router.delete('/game/:gameId', authenticate, reviewController.removeFromLibraryHandler);

export default router;