import { UserResponse } from '../interfaces/auth.interface';
import { TokenPayload, Tokens } from '@interfaces/auth.interface';
import { BAD_REQUEST, CONFLICT, NOT_FOUND } from '@/exceptions/HttpStatusCodes';
import { HttpException } from '@/exceptions/HttpException';
import { hash, compare } from 'bcrypt';
import { isEmpty } from '@utils/util';
import { User } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { CreateUserDto } from '@/dtos/auth.dto';
import { EXPIRES_IN, REFRESH_EXPIRES_IN } from '@/config/index';
import { prisma } from '@/utils/prisma';

class AuthService {
  public async me(id: number): Promise<UserResponse> {
    const currentUser = prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return currentUser;
  }

  public async signup(
    createUserDto: CreateUserDto
  ): Promise<{ createdUser: User; tokens: Tokens }> {
    if (isEmpty(createUserDto))
      throw new HttpException(BAD_REQUEST, 'userData is empty');

    const findUser = await this.findUser({
      username: createUserDto.username,
      email: createUserDto.email,
    });

    if (findUser)
      throw new HttpException(CONFLICT, `This email/username already exists`);

    const hashedPassword = await hash(createUserDto.password, 10);
    const createdUser = await prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });

    const tokens = this.generateTokens(createdUser);

    return { createdUser, tokens };
  }

  public async login(
    createUserDto: CreateUserDto
  ): Promise<{ tokens: Tokens; findUser: User }> {
    if (isEmpty(createUserDto))
      throw new HttpException(BAD_REQUEST, 'userData is empty!');

    const findUser: User = await this.findUser(createUserDto);

    if (!findUser)
      throw new HttpException(NOT_FOUND, `This username was not found!`);

    const isPasswordMatching: boolean = await compare(
      createUserDto.password,
      findUser.password
    );

    if (!isPasswordMatching)
      throw new HttpException(CONFLICT, 'Password is not matching!');

    const tokens = this.generateTokens(findUser);

    return { findUser, tokens };
  }

  public async refreshToken(
    refreshToken: string
  ): Promise<{ user: User; tokens: Tokens }> {
    const tokenPayLoad = verify(
      refreshToken,
      process.env.REFRESH_KEY
    ) as TokenPayload;

    if (!tokenPayLoad.userId) {
      throw new HttpException(BAD_REQUEST, 'Refresh token is invalid!');
    }

    // check if user info in refresh token is valid
    const user = await prisma.user.findUnique({
      where: {
        id: tokenPayLoad.userId,
      },
    });

    if (!user) throw new HttpException(NOT_FOUND, 'Notfound user in database!');

    const tokens = this.generateTokens(user);

    return { tokens, user };
  }

  private generateTokens(user: User): Tokens {
    const { id: userId, username, email } = user;
    const access_token = sign(
      { userId, username, email },
      process.env.SECRET_KEY,
      {
        expiresIn: EXPIRES_IN,
      }
    );
    const refresh_token = sign(
      { userId, username, email },
      process.env.REFRESH_KEY,
      {
        expiresIn: REFRESH_EXPIRES_IN,
      }
    );

    return {
      refresh_token,
      access_token,
    };
  }

  private async findUser({ username, email }): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    return user || null;
  }
}

export default AuthService;
