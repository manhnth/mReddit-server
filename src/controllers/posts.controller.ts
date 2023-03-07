import { NOT_FOUND } from './../common/exceptions/HttpStatusCodes';
import { HttpException } from '@/common/exceptions/HttpException';
import { SearchParams } from '../interfaces/posts.interface';
import { Request, Response } from 'express';
import { CREATE, OK } from '@/common/exceptions/HttpStatusCodes';
import PostService from '@/services/posts.service';
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HITS_PER_PAGE } from '@/config/index';

class PostsController {
  public postService = new PostService();

  public createPost = async (req: RequestWithUser, res: Response) => {
    const createPostDto: CreatePostDto = req.body;
    createPostDto.authorId = req.user.userId;

    const createdPost = await this.postService.create(createPostDto);

    const data = {
      ...createdPost,
      self: `post/${createdPost.id}`,
    };
    res
      .status(CREATE)
      .json({ createdPost: data, message: 'create post success' });
  };

  public getPostsByUser = async (req: RequestWithUser, res: Response) => {
    const { userId } = req.user;
    const posts = await this.postService.getPostByUser(userId);

    res.status(OK).json({ data: posts });
  };

  public getPostById = async (req: RequestWithUser, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?.userId;

    const p = await this.postService.getPostById(+postId as number);

    const userUpdoot = p.updoots.find((p) => p.userId === userId);
    const comments = p.comment.map((c) => {
      return {
        self: `post/${postId}/comment/${c.id}`,
        isOwner: c.ownerId === userId,
        text: c.text,
        owner: {
          name: c.owner.username,
          self: `user/${c.owner.username}`,
        },
      };
    });

    if (!p) {
      throw new HttpException(NOT_FOUND, `Not found post with id: ${postId}`);
    }

    const data = {
      ...p,
      nbComments: p._count.comment,
      self: `post/${p.id}`,
      isOwner: userId === p.authorId,
      author: {
        name: p.author.username,
        self: `user/${p.author.username}`,
      },
      comments,
      subreddit: {
        name: p.subreddit?.name || null,
        self: `r/${p.subreddit?.name || ''}`,
      },
      userUpdoot,
    };

    res.status(OK).json({ post: data });
  };

  public search = async (
    req: Request<{}, {}, {}, SearchParams>,
    res: Response
  ) => {
    const { q, page, sort_by }: SearchParams = req.query;

    const posts = await this.postService.search({ q, page, sort_by });

    res.status(OK).json({
      posts,
      page: +page,
      nbPosts: posts.length,
      nbPages: Math.ceil(posts.length / +HITS_PER_PAGE),
      query: q,
      sortBy: sort_by || 'createAt',
    });
  };

  public vote = async (req: RequestWithUser, res: Response) => {
    const { value } = req.body;
    const { postId } = req.params;
    const { userId } = req.user;

    const result = await this.postService.vote(userId, +postId, value);

    res.status(OK).json({
      message: `${result ? 'vote success!' : 'please try again!'}`,
    });
  };

  public updatePost = async (req: RequestWithUser, res: Response) => {
    const postData: UpdatePostDto = req.body;
    const postId = +req.params.postId;
    const authorId = req.user.userId;

    const updatedPost = await this.postService.update(
      postData,
      postId,
      authorId
    );

    const data = {
      ...updatedPost,
      self: `post/${updatedPost.id}`,
    };

    res.status(OK).json({ message: 'update success!', updatedPost: data });
  };

  public deletePost = async (req: RequestWithUser, res: Response) => {
    const postId = +req.params.postId;
    const authorId = req.user.userId;

    await this.postService.delete(postId, authorId);

    res.status(OK).json({ message: 'delete success!' });
  };
}

export default PostsController;
