import { Comment } from '@prisma/client';
import { prisma } from '@/utils/prisma';

class CommentService {
  public async create(
    userId: number,
    postId: number,
    text: string
  ): Promise<Comment> {
    const comment = await prisma.comment.create({
      data: {
        ownerId: userId,
        postId: postId,
        text,
      },
    });

    return comment;
  }

  public async delete(cmtId: number) {
    await prisma.comment.delete({
      where: {
        id: cmtId,
      },
    });
  }
}

export default CommentService;
