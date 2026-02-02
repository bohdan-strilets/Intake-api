import { PasswordConstraints } from '@app/common/security/constraints';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    minLength: PasswordConstraints.password.min,
    maxLength: PasswordConstraints.password.max,
  })
  @IsString()
  @MinLength(PasswordConstraints.password.min)
  @MaxLength(PasswordConstraints.password.max)
  password: string;
}
