import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import { injectable, inject } from 'inversify';
import TYPES from '../types'; 
import { Controller } from './Controller';
import { BooksService } from '../services/BooksService';
import { BookRepository } from '../repositories/BookRepository';
import { Book } from '../types/book';  

@injectable()
export class BooksController extends Controller {
  private booksService: BooksService;
  private bookRepository: BookRepository;

  constructor(
    @inject(TYPES.BookService) booksService: BooksService,
    @inject(TYPES.BookRepository) bookRepository: BookRepository
  ) {
    super();
    this.booksService = booksService;
    this.bookRepository = bookRepository;
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
    this.router.delete('/:bookId', this.deleteBook);

    this.bindRoutes([
      {
        path: '/books',
        method: 'get',
        fn: this.getBooks,
      },
      {
        path: '/books/:bookId/rating',
        method: 'post',
        fn: this.setBookRating,
      },
      {
        path: '/books',
        method: 'post',
        fn: this.addBook, 
      },
      {
        path: '/books/:bookId',
        method: 'delete',
        fn: this.deleteBook,  
      }
    ]);
  }

  private getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = Number(req.query.perPage) || 10;
      const page = Number(req.query.page) || 0;
      
      const categoryRaw: any = req.query.category;
      const category = Array.isArray(categoryRaw) 
        ? categoryRaw.filter((item: string | ParsedQs) => typeof item === 'string') 
        : (typeof categoryRaw === 'string' ? [categoryRaw] : []);
      
      const books = await this.booksService.getBooks(perPage, page, category);
      res.json(books);
    } catch (error) {
      next(error);
    }
  };

  private setBookRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.body.userId); 
        const bookId = Number(req.params.bookId); 
        const rating = Number(req.body.rating); 

        await this.booksService.setBookRating(userId, bookId, rating);
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
  };

  private deleteBook = async (req: Request, res: Response) => {
    try {
      const bookId = Number(req.params.bookId);
      if(!await this.bookRepository.findById(bookId)) {
          return res.status(404).send({ message: 'Book not found.' });
      }
      await this.bookRepository.remove(bookId);
      res.status(200).send({ message: 'Book deleted successfully.' });
    } catch (error) {
      res.status(500).send({ message: 'Error deleting book.' });
    }
  }

  private addBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBook: Book = req.body;
      await this.bookRepository.create(newBook);
      res.status(201).json(newBook);
    } catch (error) {
      next(error);
    }
  };
}
