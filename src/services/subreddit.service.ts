import { CONFLICT } from '../exceptions/HttpStatusCodes';
import { HttpException } from '../exceptions/HttpException';
import { CreateSubredditDto } from './../dtos/subreddit.dto';
import { HITS_PER_PAGE } from '@/config/index';
import { Memberships, Subreddit } from '@prisma/client';
import { prisma } from '@/utils/prisma';

class SubredditService {
  public async create(
    createSubredditDto: CreateSubredditDto,
    userId: number
  ): Promise<{ subreddit: Subreddit; memberships: Memberships }> {
    //check if subreddit name is taken
    const foundSubreddit = await prisma.subreddit.findUnique({
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

    const subreddit = await prisma.subreddit.create({
      data: {
        ...createSubredditDto,
      },
    });

    const memberships = await prisma.memberships.create({
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
    const subreddis = prisma.memberships.findMany({
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
    const subreddit = await prisma.subreddit.findUnique({
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
      ? await prisma.post.findMany({
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
      : await prisma.post.findMany({
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
