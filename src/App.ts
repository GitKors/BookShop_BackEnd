import express, { Express } from 'express';
import cors from 'cors'; 
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/AuthController';
import { BooksController } from '../controllers/BooksController';
import { RatingsController } from '../controllers/RatingsController';
import { CategoryController } from '../controllers/CategoryController';
import TYPES from '../types';
import { AuthService } from '../services/AuthService';
import { BooksService } from '../services/BooksService';
import { checkAuthMiddleware } from '../src/CheckAuthMiddleware';
import { injectable, inject } from 'inversify';
import path from 'path';

const https = require('https');
const fs = require('fs');

config();

@injectable()
class App {
  private app: Express;
  private prisma: PrismaClient;

  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.BookService) private booksService: BooksService,
    @inject(TYPES.AuthController) private authController: AuthController,
    @inject(TYPES.BookController) private booksController: BooksController,
    @inject(TYPES.RatingsController) private ratingsController: RatingsController,
    @inject(TYPES.CategoryController) private categoryController: CategoryController
  ) {
    this.app = express();
    this.prisma = new PrismaClient();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    const corsOptions = {
      allowedHeaders: ["Authorization", "Content-Type"],
      origin: '*', 
      methods: ["GET", "POST", "PUT", "DELETE"]
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());


    this.app.use((req, res, next) => {
      console.log(`GLOBAL LOG: ${req.method} ${req.path}`);
      next();
    });
  }

  private configureRoutes(): void {
    //не требуют аутентификации
    this.app.use('/api/v1', this.authController.router);
    this.app.use('/api/v1', this.booksController.router);
    // this.app.use('/api/v1', this.categoryController.router);
    this.app.use('/api/v1/books/categories', this.categoryController.router);


    //требуют аутентификации
    this.app.use('/api/v1', checkAuthMiddleware, this.ratingsController.router);
  }

  public async start(): Promise<void> {
    const port = process.env.PORT || 3000;

    // попытка с сертификатом
    const certPath = path.resolve(__dirname, '../certs/supabase_cert.pem');
    const ca = fs.readFileSync(certPath);
    https.globalAgent.options.ca = [];
    https.globalAgent.options.ca.push(ca);

    try {
        await this.prisma.$connect();
        this.app.listen(port, () => {
            console.log(`Сервер работает на порту ${port}`);
        });
    } catch (error) {
        console.error('Ошибка запуска сервера:', error);
    }
  }
}

export default App;
