import { UserService } from '../../domain/services/UserService.js';
import { UserRepository } from '../../infrastructure/repositories/UserRepository.js';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from '../dto/UserDTO.js';
import jwt from 'jsonwebtoken';
import { config } from '../../infrastructure/config/index.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function registerUser(data: CreateUserDTO) {
  const user = await userService.create(data);
  const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
  return { user: { ...user, password: undefined }, token };
}

export async function loginUser(data: LoginUserDTO) {
  const user = await userService.findByEmail(data.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await userService.validatePassword(user as unknown as CreateUserDTO & { _id: string }, data.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
  return { user: { ...user, password: undefined }, token };
}

export async function getUserProfile(userId: string) {
  const user = await userService.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return { ...user, password: undefined };
}

export async function updateUserProfile(userId: string, data: UpdateUserDTO) {
  const user = await userService.update(userId, data, userId);
  if (!user) {
    throw new Error('User not found');
  }
  return { ...user, password: undefined };
}