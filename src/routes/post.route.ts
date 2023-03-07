import { attachUserToRequest } from './../common/middlewares/auth.middleware';
import PostsController from '@/controllers/posts.controller';
import { Routes } from '@/interfaces/routes.interface';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { Router } from 'express';

class PostRoute implements Routes {
  public path = '/post';
  public router = Router();
  public postController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      this.postController.createPost
    );
    this.router.post(
      `${this.path}/getByUser`,
      authMiddleware,
      this.postController.getPostsByUser
    );
    this.router.post(
      `${this.path}/:postId/vote`,
      authMiddleware,
      this.postController.vote
    );
    this.router.patch(
      `${this.path}/:postId`,
      authMiddleware,
      this.postController.updatePost
    );
    this.router.get(`${this.path}/search`, this.postController.search);
    this.router.get(
      `${this.path}/:postId`,
      attachUserToRequest,
      this.postController.getPostById
    );
    this.router.delete(
      `${this.path}/:postId`,
      authMiddleware,
      this.postController.deletePost
    );
  }
}

export default PostRoute;
