import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  email: string;
}
