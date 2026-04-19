import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import {
  getUserLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addGameToList,
  removeGameFromList
} from '../../application/useCases/listUseCases.js';

export async function getMyLists(req: AuthRequest, res: Response) {
  try {
    const lists = await getUserLists(req.user!._id);
    res.json(lists);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const list = await getListById(req.params.id);
    res.json(list);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const list = await createList(req.body, req.user!._id);
    res.status(201).json(list);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const list = await updateList(req.params.id, req.body, req.user!._id);
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteList(req.params.id, req.user!._id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function addGame(req: AuthRequest, res: Response) {
  try {
    const { gameId } = req.body;
    const list = await addGameToList(req.params.id, gameId, req.user!._id);
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function removeGame(req: AuthRequest, res: Response) {
  try {
    const { gameId } = req.body;
    const list = await removeGameFromList(req.params.id, gameId, req.user!._id);
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}