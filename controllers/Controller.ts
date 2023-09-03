import { Router, Request, Response, NextFunction } from 'express';
import { Middleware } from '../src/Middleware';
import { injectable } from 'inversify';

interface ControllerRoute {
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  fn: (req: Request, res: Response, next: NextFunction) => void;
  middleware?: Middleware[];
}

@injectable()
export class Controller {
  private _router: Router;

  constructor() {
    this._router = Router();
  }

  protected bindRoutes(routes: ControllerRoute[]) {
    routes.forEach((route) => {
      const ctxHandler = route.fn.bind(this);
      this._router[route.method ?? 'get'](route.path, ctxHandler);
    });
  }

  public get router(): Router {
    return this._router;
  }
}
