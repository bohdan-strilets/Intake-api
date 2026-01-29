import { UserConstraints } from '@app/users/constraints';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(UserConstraints.password.minLength)
  @MaxLength(UserConstraints.password.maxLength)
  password: string;
}
