import AuthController from '@/controllers/auth.controller';
import { Routes } from '@/interfaces/routes.interface';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signup);
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.get(`${this.path}/me`, authMiddleware, this.authController.me);
    this.router.post(`${this.path}/refresh`, this.authController.refresh);
  }
}

export default AuthRoute;
