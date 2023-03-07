import { CONFLICT } from '../exceptions/HttpStatusCodes';
import { HttpException } from '../exceptions/HttpException';
import { CreateSubredditDto } from './../dtos/subreddit.dto';
import { HITS_PER_PAGE } from '@/config/index';
import { Memberships, PrismaClient, Subreddit } from '@prisma/client';

class SubredditService {
  public subreddit = new PrismaClient().subreddit;
  public post = new PrismaClient().post;
  public memberships = new PrismaClient().memberships;

  public async create(
    createSubredditDto: CreateSubredditDto,
    userId: number
  ): Promise<{ subreddit: Subreddit; memberships: Memberships }> {
    //check if subreddit name is taken
    const foundSubreddit = await this.subreddit.findUnique({
      where: {
        name: createSubredditDto.name,
      },
    });

    if (foundSubreddit) {
      throw new HttpException(
        CONFLICT,
        `Sorry, r/${createSubredditDto.name} is taken. Try another.`
      );
    }

    const subreddit = await this.subreddit.create({
      data: {
        ...createSubredditDto,
      },
    });

    const memberships = await this.memberships.create({
      data: {
        memberId: userId,
        role: 'OWNER',
        subredditId: subreddit.id,
      },
    });

    return { subreddit, memberships };
  }

  public async getSubredditUser(
    userId: number
  ): Promise<{ subreddit: Subreddit }[]> {
    const subreddis = this.memberships.findMany({
      where: {
        memberId: userId,
      },
      select: {
        subreddit: true,
      },
    });

    return subreddis;
  }

  public async getSubredditByName(name: string) {
    const subreddit = await this.subreddit.findUnique({
      where: { name: name },
      select: {
        name: true,
        about: true,
        post: true,
        _count: {
          select: { post: true, memberships: true },
        },
      },
    });
    return subreddit;
  }

  public async getSubredditPosts(name: string, page: number, sort_by: string) {
    page = page | 1;
    const isSortByPoint = sort_by === 'point';

    const posts = isSortByPoint
      ? await this.post.findMany({
          where: {
            subreddit: {
              name: name,
            },
          },
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
          skip: +HITS_PER_PAGE * (page - 1),
          take: +HITS_PER_PAGE,
          orderBy: {
            point: 'desc',
          },
        })
      : await this.post.findMany({
          where: {
            subreddit: {
              name: name,
            },
          },
          include: {
            author: true,
          },
          skip: +HITS_PER_PAGE * (page - 1),
          take: +HITS_PER_PAGE,
          orderBy: {
            createAt: 'desc',
          },
        });

    return posts;
  }
}

export default SubredditService;
