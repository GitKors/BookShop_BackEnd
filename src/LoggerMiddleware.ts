import { Middleware } from './Middleware';
import { Request, Response, NextFunction } from 'express';

export class LoggerMiddleware extends Middleware {
    handle(req: Request, res: Response, next: NextFunction): void {

        next();
    }
}
