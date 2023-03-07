import AuthController from '@/controllers/auth.controller';
import { Routes } from '@/interfaces/routes.interface';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { Router } from 'express';
import CommentController from '@/controllers/comment.controller';

class CommentRoute implements Routes {
  public path = '/post';
  public router = Router();
  public commentController = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/:postId/comment`,
      authMiddleware,
      this.commentController.create
    );
    this.router.delete(
      `${this.path}/:postId/comment/:cmtId`,
      authMiddleware,
      this.commentController.delete
    );
  }
}

export default CommentRoute;
