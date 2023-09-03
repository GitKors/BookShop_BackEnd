import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    userId: number;
  };
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export const checkAuthMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');

  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);


  if (!token) {
    console.log("Token not found in", req.headers, req.body);
    return next(new UnauthorizedError('Необходимо предоставить токен'));
  }

  try {
    console.log('Verifying JWT token'); 
    const decodedToken = jwt.verify(token, process.env.JWTSECRET || '');
    req.user = decodedToken as { userId: number };
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT verification error:", error.message);
  } else {
      console.error("Unknown error during JWT verification:", error);
  }
  return next(new UnauthorizedError('Неправильный токен'));
  }
};
