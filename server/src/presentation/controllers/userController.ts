import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../../application/useCases/userUseCases.js';

export async function register(req: AuthRequest, res: Response) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await getUserProfile(req.user!._id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export async function updateMe(req: AuthRequest, res: Response) {
  try {
    const user = await updateUserProfile(req.user!._id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}