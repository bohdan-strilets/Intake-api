import { AuthUser } from '../types';

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
