export { register, login, getMe, updateMe } from './userController.js';
export { getAll as getGames, getById as getGameById, create as createGame, update as updateGame, remove as deleteGame } from './gameController.js';
export { getMyLists, getById as getListById, create as createList, update as updateList, remove as deleteList, addGame as addGameToList, removeGame as removeGameFromList } from './listController.js';
export { getGameReviewsHandler, getMyReviewsHandler, create as createReview, update as updateReview, remove as deleteReview } from './reviewController.js';