import { PasswordConstraints } from '@app/common/security/constraints';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token from email' })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    minLength: PasswordConstraints.password.min,
    maxLength: PasswordConstraints.password.max,
  })
  @IsString()
  @MinLength(PasswordConstraints.password.min)
  @MaxLength(PasswordConstraints.password.max)
  newPassword: string;
}
