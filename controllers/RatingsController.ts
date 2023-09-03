// import { Container } from 'inversify';
import { Request, Response, NextFunction, Router } from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { Controller } from './Controller';
import { BooksService } from '../services/BooksService';
import { checkAuthMiddleware } from '../src/CheckAuthMiddleware'; 

@injectable()
export class RatingsController extends Controller {
  private booksService: BooksService;

  constructor(@inject(TYPES.BookService) booksService: BooksService) {
    super();
    this.booksService = booksService;

    this.bindRoutes([
      {
        path: '/book/ratings',
        method: 'post',
        fn: this.setBookRating,
      },
    ]);
  }

  private setBookRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId, rating } = req.body;
      const userId = (req as any).user?.userId;
  
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }
  
      await this.booksService.setBookRating(userId, bookId, rating);
      res.status(200).json({ message: 'Оценка установлена' });
    } catch (error) {
      next(error);
    }
  }
}


