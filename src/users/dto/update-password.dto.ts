import { IsString, MaxLength, MinLength } from 'class-validator';

import { UserConstraints } from '../constraints';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(UserConstraints.password.minLength)
  @MaxLength(UserConstraints.password.maxLength)
  currentPassword: string;

  @IsString()
  @MinLength(UserConstraints.password.minLength)
  @MaxLength(UserConstraints.password.maxLength)
  newPassword: string;
}
