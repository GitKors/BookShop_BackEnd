import express, { Router, Request, Response } from 'express';
import { Book } from '../types/book';
import { BookRepository } from '../repositories/BookRepository';
import { DatabaseService } from '../services/DatabaseService';

const bookRepository = new BookRepository(new DatabaseService());
const router: Router = express.Router();

// Получение списка всех книг
router.get('/', async (req: Request, res: Response) => {
    try {
        const books = await bookRepository.findAll();
        res.json(books);
    } catch (error) {
        res.status(500).send('Ошибка получения списка книг');
    }
});

// Добавление книги
router.post('/', async (req: Request, res: Response) => {
    try {
        const newBook: Book = req.body;
        await bookRepository.create(newBook);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).send('Ошибка добавления книги');
    }
});

// Редактирование книги
router.put('/:bookId', async (req: Request, res: Response) => {
  const bookId: number = parseInt(req.params.bookId, 10);
  const updatedBook: Book = req.body;
  try {
      await bookRepository.edit(bookId, updatedBook);
      res.json(updatedBook);
  } catch (error) {
      res.status(500).send('Ошибка редактирования книги');
  }
});

// Удаление книги
// router.delete('/:bookId', async (req: Request, res: Response) => {
//   const bookId: number = parseInt(req.params.bookId, 10);
//   try {
//       await bookRepository.remove(bookId);
//       res.send('Книга успешно удалена');
//   } catch (error) {
//       res.status(500).send('Ошибка удаления книги');
//   }
// });

// export default router;
