import { AuthUserResponse } from '../types';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;
}
