import { PrismaClient } from '@prisma/client';
import { NOT_FOUND } from './../common/exceptions/HttpStatusCodes';
import { HttpException } from './../common/exceptions/HttpException';
import { Request, Response } from 'express';
import { CREATE, OK } from '@/common/exceptions/HttpStatusCodes';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateSubredditDto } from '@/dtos/subreddit.dto';
import SubredditService from '@/services/subreddit.service';

class SubredditController {
  public subredditService = new SubredditService();
  public prisma = new PrismaClient();

  public create = async (req: RequestWithUser, res: Response) => {
    const createSubredditDto: CreateSubredditDto = req.body;
    const { userId } = req.user;

    const { memberships, subreddit } = await this.subredditService.create(
      createSubredditDto,
      userId
    );

    res.status(CREATE).json({
      message: 'create subreddit success!',
      owner: {
        self: `user/${memberships.memberId}`,
      },
      subreddit,
    });
  };

  public getByUser = async (req: RequestWithUser, res: Response) => {
    const { userId } = req.user;

    const subreddits = await this.subredditService.getSubredditUser(userId);

    const subredditRepose = subreddits.map((sr) => {
      const { subreddit } = sr;
      return {
        self: `r/${subreddit.name}`,
        name: subreddit.name,
        id: subreddit.id,
        about: subreddit.about,
      };
    });

    res.status(OK).json({ mySubreddits: subredditRepose });
  };

  public getInfoByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    const subreddit = await this.subredditService.getSubredditByName(name);

    if (!subreddit) {
      throw new HttpException(
        NOT_FOUND,
        `Not found subreddit with name ${name} `
      );
    }

    const response = {
      name: subreddit.name,
      about: subreddit.about,
      nbMembers: subreddit._count.memberships,
      nbPosts: subreddit._count.post,
    };

    res.status(OK).json({ subreddit: response });
  };

  public getSubredditPosts = async (req: Request, res: Response) => {
    const { name } = req.params;
    const { page, sort_by } = req.query;

    const posts = await this.subredditService.getSubredditPosts(
      name,
      +page,
      sort_by as string
    );

    const responseData = posts.map((p) => {
      return {
        ...p,
        self: `post/${p.id}`,
        author: {
          self: `user/${p.author.username}`,
          name: p.author.username,
        },
      };
    });

    res.status(OK).json({ posts: responseData });
  };
}

export default SubredditController;
