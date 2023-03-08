import { UNAUTHORIZED } from '@/exceptions/HttpStatusCodes';
import { HITS_PER_PAGE } from '@/config/index';
import { SearchParams } from '../interfaces/posts.interface';
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto';
import { Post } from '@prisma/client';
import { HttpException } from '@/exceptions/HttpException';
import { prisma } from '@/utils/prisma';

class PostService {
  public async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        ...createPostDto,
        voteStatus: 0,
        point: 0,
      },
    });

    return post;
  }

  public async getPostByUser(userId: number) {
    const posts = prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        username: true,
        email: true,
        posts: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    return posts;
  }

  public async getPostById(postId: number) {
    return await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comment: {
          include: {
            owner: {
              select: {
                username: true,
              },
            },
          },
        },
        author: true,
        updoots: true,
        subreddit: true,
        _count: {
          select: {
            comment: true,
          },
        },
      },
    });
  }

  public async search(searchParams: SearchParams): Promise<Post[]> {
    const { q, page, sort_by } = searchParams;
    const hitsPerPage = +HITS_PER_PAGE;
    const result: Post[] = await prisma.$queryRawUnsafe(
      `select * from "Post" where ("title" like $1 or "text" like $1) order by ${
        sort_by || `"createAt"`
      } desc limit 10 offset $2`,
      `%${q || ''}%`,
      +`${(+page - 1) * hitsPerPage}`
    );

    return result;
  }

  public async vote(userId: number, postId: number, value: number) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;

    const updoot = await prisma.updoot.findFirst({
      where: {
        AND: [{ postId }, { userId }],
      },
    });

    if (updoot && updoot.value !== realValue) {
      await prisma.updoot.update({
        where: {
          id: updoot.id,
        },
        data: {
          value: realValue,
        },
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          point: {
            increment: realValue * 2,
          },
        },
      });
    }

    if (!updoot) {
      await prisma.updoot.create({
        data: {
          postId: postId,
          userId: userId,
          value: realValue,
        },
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          point: {
            increment: realValue,
          },
        },
      });
    }

    return true;
  }

  public async update(postData: UpdatePostDto, postId: number, userId: number) {
    const post = await prisma.post.findFirst({
      where: {
        authorId: userId,
      },
    });

    if (!post)
      throw new HttpException(UNAUTHORIZED, 'Not have permission to update!');

    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...postData,
      },
    });
  }

  public async delete(postId: number, userId: number) {
    const post = await prisma.post.findFirst({
      where: {
        authorId: userId,
      },
    });

    if (!post)
      throw new HttpException(UNAUTHORIZED, 'Not have permission to delete!');

    await prisma.comment.deleteMany({
      where: {
        post: {
          id: postId,
        },
      },
    });

    await prisma.updoot.deleteMany({
      where: {
        postId: postId,
      },
    });

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
export default PostService;
