import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types'; 
import { Controller } from './Controller';
import { AuthService } from '../services/AuthService';
import { ValidateMiddleware } from '../src/ValidateMiddleware';


@injectable()
export class AuthController extends Controller {
  private authService: AuthService;

  constructor(
    @inject(TYPES.AuthService) authService: AuthService
  ) {
    super();
    this.authService = authService;

    this.bindRoutes([
      {
        path: '/user/login',
        method: 'post',
        fn: this.login,
        middleware: [new ValidateMiddleware()],
      },
      {
        path: '/user/register',
        method: 'post',
        fn: this.register,
        middleware: [new ValidateMiddleware()],
      },
    ]);
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const { login, password } = req.body;
      console.log('Body:', req.body);
      const token = await this.authService.login(login, password);
      res.json({ token });

    } catch (error) {
      next(error);
    }
  };

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        await this.authService.register(username, password);
        res.sendStatus(201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Пользователь с таким именем уже существует.') {
            res.status(400).json({ message: error.message });
        } else {
            next(error);
        }
    } else {
        next(error);
    }
    }
};
}
