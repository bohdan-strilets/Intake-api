import { UserResponseDto } from '@app/users/dto';
import { ApiProperty } from '@nestjs/swagger';

import { AuthTokensResponseDto } from './auth-tokens-response.dto';

export class AuthResponseDto {
  @ApiProperty()
  tokens: AuthTokensResponseDto;

  @ApiProperty()
  user: UserResponseDto;
}
