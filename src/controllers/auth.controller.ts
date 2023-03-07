import { RequestWithUser } from './../interfaces/auth.interface';
import AuthService from '@/services/auth.service';
import { Request, Response } from 'express';
import { CREATE, OK } from '@/exceptions/HttpStatusCodes';
import { CreateUserDto } from '@/dtos/auth.dto';

class AuthController {
  public authService = new AuthService();

  public signup = async (req: Request, res: Response) => {
    const createUserDto: CreateUserDto = req.body;

    const { createdUser, tokens } = await this.authService.signup(
      createUserDto
    );

    res.status(CREATE).json({
      message: 'signup success!',
      tokens,
      user: {
        username: createdUser.username,
        email: createdUser.email,
      },
    });
  };

  public login = async (req: Request, res: Response) => {
    const dataUser: CreateUserDto = req.body;

    const { findUser, tokens } = await this.authService.login(dataUser);

    res.status(OK).json({
      message: 'Login success!',
      tokens,
      user: {
        username: findUser.username,
        email: findUser.email,
      },
    });
  };

  public me = async (req: RequestWithUser, res: Response) => {
    const { userId } = req.user;

    const currentUser = await this.authService.me(userId);
    res.status(OK).json({ currentUser });
  };

  public refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const { tokens, user } = await this.authService.refreshToken(refreshToken);

    res.status(OK).json({
      message: 'refresh success',
      tokens,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  };
}

export default AuthController;
