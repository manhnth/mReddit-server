import { attachUserToRequest } from './../common/middlewares/auth.middleware';
import { Routes } from '@/interfaces/routes.interface';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { Router } from 'express';
import FeedController from '@/controllers/feed.controller';

class FeedRoute implements Routes {
  public path = '/feed';
  public router = Router();
  public feedController = new FeedController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      attachUserToRequest,
      // authMiddleware,
      this.feedController.getGlobalFeed
    );
    // this.router.get(`${this.path}/`, this.feedController.getGlobalFeed);
    // this.router.post(`${this.path}/`, this.feedController.login);
    this.router.get(
      `${this.path}/me`,
      authMiddleware,
      this.feedController.getUserFeed
    );
  }
}

export default FeedRoute;
