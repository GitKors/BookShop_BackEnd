import { Request, Response, NextFunction } from 'express';

export class ValidateMiddleware {
  public handle(req: Request, res: Response, next: NextFunction) {
    const { login, password } = req.body;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
    
    if (!login || !password) {
      return res.status(422).json({ error: 'Username and password are required' });
    }
    if (login && !isEmail) {
      return res.status(422).json({ error: 'Invalid email address' });
    }
    if (password.length < 6) {
      return res.status(422).json({ error: 'Password must be at least 6 characters long' });
    }

    next();
  }
}
