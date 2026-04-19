import { IUserRepository } from '../repositories/IUserRepository.js';
import { IUserCreate, IUserUpdate } from '../entities/IUser.js';
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async create(data: IUserCreate) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'user'
    });
  }

  async update(id: string, data: IUserUpdate, currentUserId: string) {
    if (id !== currentUserId) {
      throw new Error('Unauthorized');
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && existing._id !== id) {
        throw new Error('Email already in use');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: string, currentUserId: string, currentUserRole: string) {
    if (id !== currentUserId && currentUserRole !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.userRepository.delete(id);
  }

  async validatePassword(user: IUserCreate & { _id: string }, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}