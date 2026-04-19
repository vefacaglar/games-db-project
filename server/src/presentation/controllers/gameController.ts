import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { getGames, getGameById, createGame, updateGame, deleteGame } from '../../application/useCases/gameUseCases.js';

export async function getAll(req: AuthRequest, res: Response) {
  try {
    const filters = {
      genre: req.query.genre as string | undefined,
      platform: req.query.platform as string | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined
    };
    const result = await getGames(filters);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const game = await getGameById(req.params.id);
    res.json(game);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const game = await createGame(req.body, req.user!);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const game = await updateGame(req.params.id, req.body, req.user!);
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteGame(req.params.id, req.user!);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}