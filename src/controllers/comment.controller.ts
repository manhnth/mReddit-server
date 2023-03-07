import { RequestWithUser } from './../interfaces/auth.interface';
import AuthService from '@/services/auth.service';
import { Request, Response } from 'express';
import { CREATE, OK } from '@/common/exceptions/HttpStatusCodes';
import { CreateUserDto } from '@/dtos/auth.dto';
import commentService from '@/services/comment.service';

class CommentController {
  public commentService = new commentService();

  public create = async (req: RequestWithUser, res: Response) => {
    const { userId } = req.user;
    const { postId } = req.params;
    const { text } = req.body;

    const comment = await this.commentService.create(userId, +postId, text);

    res.status(CREATE).json({ comment });
  };

  public delete = async (req: RequestWithUser, res: Response) => {
    const { userId } = req.user;
    const { postId, cmtId } = req.params;
    const { text } = req.body;

    await this.commentService.delete(+cmtId);

    res.status(CREATE).json({ message: 'delete success!' });
  };
}

export default CommentController;
