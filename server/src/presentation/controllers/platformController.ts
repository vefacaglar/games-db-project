import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { PlatformRepository } from '../../infrastructure/repositories/PlatformRepository.js';

const platformRepository = new PlatformRepository();

export async function getAll(req: AuthRequest, res: Response) {
  try {
    const platforms = await platformRepository.findAll();
    res.json(platforms);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const platform = await platformRepository.create(req.body);
    res.status(201).json(platform);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    await platformRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}