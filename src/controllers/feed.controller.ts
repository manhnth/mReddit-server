import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from './../interfaces/auth.interface';
import { Request, Response } from 'express';
import { OK } from '@/exceptions/HttpStatusCodes';
import FeedService from '@/services/feed.service';
import { HITS_PER_PAGE } from '@/config/index';

class FeedController {
  public feedService = new FeedService();
  public prisma = new PrismaClient();

  public getGlobalFeed = async (req: RequestWithUser, res: Response) => {
    const { page, sort_by } = req.query;
    const pageNumber = page as string;
    const userId = req.user?.userId || null;

    const sortBy = sort_by === 'hot' ? 'point' : 'createAt';

    const posts = await this.feedService.getGlobalFeed(+pageNumber, sortBy);

    const pagesCount = await this.prisma.post.count();

    const totalPages = Math.ceil(pagesCount / +HITS_PER_PAGE);
    const isNextPage = +pageNumber < totalPages;

    const data = posts.map((p) => {
      const { authorId, subredditId, _count, ...res } = p;
      return {
        ...res,
        nbComments: _count.comment,
        self: `post/${p.id}`,
        isOwner: userId === p.authorId,
        author: {
          name: p.author.username,
          self: `user/${p.author.username}`,
        },
        subreddit: {
          name: p.subreddit?.name || null,
          self: `r/${p.subreddit?.name || ''}`,
          isJoined: false,
        },
        userUpdoot: p.updoots.find((u) => u.userId === userId),
      };
    });

    res.status(OK).json({
      feed: data,
      page: +page,
      totalPages,
      nextPage: isNextPage ? +page + 1 : null,
    });
  };

  public getUserFeed = async (req: RequestWithUser, res: Response) => {
    const { userId } = req.user;
    const { page, sort_by } = req.query;
    const sortBy = sort_by === 'hot' ? 'point' : 'createAt';
    const pageNumber = page as string;

    const posts = await this.feedService.getUserFeed(
      userId,
      +pageNumber,
      sortBy
    );

    const data = posts.map((p) => {
      const { authorId, subredditId, id, _count, updoots, ...res } = p;
      const isUpdote = updoots.find((updoot) => updoot.userId === authorId);
      return {
        ...res,
        self: `post/${id}`,
        author: {
          name: p.author.username,
          self: `user/${p.author.username}`,
        },
        subreddit: {
          name: p.subreddit?.name || null,
          self: `r/${p.subreddit.name}`,
          isJoined: '',
        },
        nbComments: _count.comment,
        updoot: {
          isUpdoot: isUpdote ? true : false,
          value: isUpdote?.value || null,
        },
      };
    });

    res.status(OK).json({
      feed: data,
    });
  };
}

export default FeedController;
