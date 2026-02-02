import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
