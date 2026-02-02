import { PasswordConstraints } from '@app/common/security/constraints';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(PasswordConstraints.password.min)
  @MaxLength(PasswordConstraints.password.max)
  currentPassword: string;

  @IsString()
  @MinLength(PasswordConstraints.password.min)
  @MaxLength(PasswordConstraints.password.max)
  newPassword: string;
}
