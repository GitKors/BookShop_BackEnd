import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import TYPES from './types'; 
import App from './src/App';
import { DatabaseService } from './services/DatabaseService';
import { BookRepository } from './repositories/BookRepository';
import { BooksController } from './controllers/BooksController'; 
import { BooksService } from './services/BooksService'; 
import { AuthService } from './services/AuthService'; 
import { AuthController } from './controllers/AuthController';
import { RatingsController } from './controllers/RatingsController';
import { CategoryController } from './controllers/CategoryController';

const container = new Container();
container.bind<App>(TYPES.App).to(App);


container.bind<CategoryController>(TYPES.CategoryController).to(CategoryController);

container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
container.bind<BookRepository>(TYPES.BookRepository).to(BookRepository);
// Зависимости для BooksController
container.bind<BooksController>(TYPES.BookController).to(BooksController);
container.bind<BooksService>(TYPES.BookService).to(BooksService); 

container.bind<RatingsController>(TYPES.RatingsController).to(RatingsController); //Err
// Зависимости для AuthService
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
// Зависимости для PrismaClient
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

const app = container.get<App>(TYPES.App);
app.start();