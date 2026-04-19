import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { getGameReviews, getMyReviews, createReview, updateReview, deleteReview } from '../../application/useCases/reviewUseCases.js';

export async function getGameReviewsHandler(req: AuthRequest, res: Response) {
  try {
    const reviews = await getGameReviews(req.params.gameId);
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getMyReviewsHandler(req: AuthRequest, res: Response) {
  try {
    const reviews = await getMyReviews(req.user!._id);
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const review = await createReview(req.body, req.user!);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const review = await updateReview(req.params.id, req.body, req.user!);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteReview(req.params.id, req.user!);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}