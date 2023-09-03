import express, { Router } from 'express';
import { User } from '../types/user';

const router: Router = express.Router();

const users: User[] = [
  { id: 1, name: 'User 1', email: 'user1@example.com' },
  { id: 2, name: 'User 2', email: 'user2@example.com' },
];

router.get('/', (req, res) => {
  res.json(users);
});

// Добавьте остальные CRUD операции

export default router;
