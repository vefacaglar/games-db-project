import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { 
  getGameSubmissions, 
  getMySubmissions,
  getPendingSubmissions,
  createSubmission, 
  updateSubmission, 
  deleteSubmission,
  approveSubmission,
  rejectSubmission,
  getUserLibrary,
  getUserLibraryByStatus,
  addToLibrary,
  updateLibraryEntry,
  removeFromLibrary
} from '../../application/useCases/reviewUseCases.js';

export async function getGameSubmissionsHandler(req: AuthRequest, res: Response) {
  try {
    const submissions = await getGameSubmissions(req.params.gameId);
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getMySubmissionsHandler(req: AuthRequest, res: Response) {
  try {
    const submissions = await getMySubmissions(req.user!._id);
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getPendingSubmissionsHandler(req: AuthRequest, res: Response) {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const submissions = await getPendingSubmissions();
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const submission = await createSubmission(req.body, req.user);
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const submission = await updateSubmission(req.params.id, req.body, req.user!);
    res.json(submission);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteSubmission(req.params.id, req.user!);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function approve(req: AuthRequest, res: Response) {
  try {
    const result = await approveSubmission(req.params.id, req.user!);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function reject(req: AuthRequest, res: Response) {
  try {
    const result = await rejectSubmission(req.params.id, req.user!);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getLibraryHandler(req: AuthRequest, res: Response) {
  try {
    const status = req.query.status as string;
    const entries = status 
      ? await getUserLibraryByStatus(req.user!._id, status)
      : await getUserLibrary(req.user!._id);
    res.json(entries);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function addToLibraryHandler(req: AuthRequest, res: Response) {
  try {
    const entry = await addToLibrary({ ...req.body, user: req.user!._id });
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateLibraryHandler(req: AuthRequest, res: Response) {
  try {
    const entry = await updateLibraryEntry(req.params.id, req.body, req.user!._id);
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function removeFromLibraryHandler(req: AuthRequest, res: Response) {
  try {
    await removeFromLibrary(req.user!._id, req.params.gameId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}