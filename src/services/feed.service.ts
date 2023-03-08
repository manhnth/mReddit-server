import { HITS_PER_PAGE } from '@/config/index';
import { prisma } from '@/utils/prisma';

class FeedService {
  public async getGlobalFeed(pageNumber: number, sortBy: string) {
    const page = pageNumber || 1;

    return await prisma.post.findMany({
      include: {
        subreddit: true,
        author: true,
        _count: { select: { comment: true } },
        updoots: true,
      },
      take: +HITS_PER_PAGE,
      skip: +HITS_PER_PAGE * (page - 1),
      orderBy: {
        [sortBy]: 'desc',
      },
    });
  }

  public async getUserFeed(userId: number, pageNumber: number, sortBy: string) {
    const page = pageNumber | 1;

    return await prisma.post.findMany({
      where: {
        subreddit: {
          memberships: {
            every: {
              memberId: userId,
            },
          },
        },
      },
      include: {
        subreddit: true,
        author: true,
        updoots: true,
        _count: { select: { comment: true } },
      },
      take: +HITS_PER_PAGE,
      skip: +HITS_PER_PAGE * (page - 1),
      orderBy: { [sortBy]: 'desc' },
    });
  }
}

export default FeedService;
