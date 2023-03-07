import { Routes } from '@/interfaces/routes.interface';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { Router } from 'express';
import SubredditController from '@/controllers/subreddit.controller';

class SubredditRoute implements Routes {
  public path = '/r';
  public router = Router();
  public subredditController = new SubredditController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      this.subredditController.create
    );
    this.router.get(`${this.path}/popular`);
    this.router.get(
      `${this.path}/my`,
      authMiddleware,
      this.subredditController.getByUser
    );
    this.router.get(
      `${this.path}/:name`,
      this.subredditController.getInfoByName
    );
    this.router.get(
      `${this.path}/:name/posts`,
      this.subredditController.getSubredditPosts
    );
  }
}

export default SubredditRoute;
