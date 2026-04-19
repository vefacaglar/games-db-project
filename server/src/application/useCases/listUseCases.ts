import { ListService } from '../../domain/services/ListService.js';
import { ListRepository } from '../../infrastructure/repositories/ListRepository.js';
import { CreateListDTO, UpdateListDTO } from '../dto/ListDTO.js';

const listRepository = new ListRepository();
const listService = new ListService(listRepository);

export async function getUserLists(userId: string) {
  return listService.findByUserId(userId);
}

export async function getListById(id: string) {
  const list = await listService.findById(id);
  if (!list) {
    throw new Error('List not found');
  }
  return list;
}

export async function createList(data: CreateListDTO, userId: string) {
  return listService.create({ ...data, user: userId });
}

export async function updateList(id: string, data: UpdateListDTO, userId: string) {
  const list = await listService.update(id, data, userId);
  if (!list) {
    throw new Error('List not found');
  }
  return list;
}

export async function deleteList(id: string, userId: string) {
  const result = await listService.delete(id, userId);
  if (!result) {
    throw new Error('List not found');
  }
  return { success: true };
}

export async function addGameToList(listId: string, gameId: string, userId: string) {
  const list = await listService.addGame(listId, gameId, userId);
  if (!list) {
    throw new Error('List not found');
  }
  return list;
}

export async function removeGameFromList(listId: string, gameId: string, userId: string) {
  const list = await listService.removeGame(listId, gameId, userId);
  if (!list) {
    throw new Error('List not found');
  }
  return list;
}