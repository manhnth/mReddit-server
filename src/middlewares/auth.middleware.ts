import { BAD_REQUEST } from '../exceptions/HttpStatusCodes';
import { TokenPayload } from '../interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import { UNAUTHORIZED } from '@/exceptions/HttpStatusCodes';
import { prisma } from '@/utils/prisma';

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const Authorization =
    req.cookies['Authorization'] ||
    (req.header('Authorization')
      ? req.header('Authorization').split('Bearer ')[1]
      : null);

  if (Authorization) {
    const secretKey: string = process.env.SECRET_KEY;
    const verificationResponse = verify(
      Authorization,
      secretKey
    ) as TokenPayload;

    const userId = verificationResponse.userId;

    const users = prisma.user;
    const findUser = await users.findUnique({
      where: { id: Number(userId) },
    });

    if (findUser) {
      req.user = verificationResponse;
      next();
    } else {
      next(new HttpException(UNAUTHORIZED, 'Wrong authentication token'));
    }
  } else {
    next(new HttpException(401, 'No token on authorization headers'));
  }
};

export const attachUserToRequest = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies['Authorization'] ||
      (req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null);

    if (Authorization) {
      const secretKey: string = process.env.SECRET_KEY;

      const verificationResponse = verify(
        Authorization,
        secretKey
      ) as TokenPayload;

      if (verificationResponse) req.user = verificationResponse;
    }
    next();
  } catch (error) {
    next;
  }
};
