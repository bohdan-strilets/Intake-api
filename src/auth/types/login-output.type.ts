import { AuthUser } from './auth-user.type';

export type LoginOutput = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
