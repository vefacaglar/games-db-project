import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../infrastructure/config/index.js';
import { IUser } from '../../domain/entities/IUser.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    req.user = {
      _id: decoded.userId,
      username: '',
      email: '',
      password: '',
      role: decoded.role as 'user' | 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    req.user = {
      _id: decoded.userId,
      username: '',
      email: '',
      password: '',
      role: decoded.role as 'user' | 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch {
    // Token invalid, but continue without auth
  }
  next();
}