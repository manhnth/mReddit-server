import { Request } from 'express';

export interface TokenPayload {
  userId: number;
  username: string;
  email: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: TokenPayload;
}
