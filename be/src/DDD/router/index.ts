import UserRouter from "../../DDD/user/router/user.router";
import AuthRouter from "../../DDD/auth/router/index";
import { Router } from "express";

export class RouterModule {
  private static router: Router;

  public static getRouter(): Router {
    if (!RouterModule.router) {
      RouterModule.router = Router();
      RouterModule.initializeRoutes();
    }
    return RouterModule.router;
  }

  private static initializeRoutes(): void {
    RouterModule.router.use('/auth', AuthRouter);
    RouterModule.router.use('/user', UserRouter)
  }
}