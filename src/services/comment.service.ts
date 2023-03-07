import { HITS_PER_PAGE } from '@/config/index';
import { SearchParams } from '../interfaces/posts.interface';
import { FetchPostsResponse } from '@interfaces/posts.interface';
import { FetchPostsParams, UpdatePostDto } from '@/dtos/posts.dto';
import { Comment, Post, PrismaClient } from '@prisma/client';

class CommentService {
  public prisma = new PrismaClient();

  public async create(
    userId: number,
    postId: number,
    text: string
  ): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: {
        ownerId: userId,
        postId: postId,
        text,
      },
    });

    return comment;
  }

  public async delete(cmtId: number) {
    await this.prisma.comment.delete({
      where: {
        id: cmtId,
      },
    });
  }
}

export default CommentService;
