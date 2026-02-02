import { ValidationException } from '../errors/exceptions';
import { PasswordConstraints } from './constraints';
import { digitRegex, letterRegex } from './regex';

export class PasswordPolicy {
  static validate(password: string): void {
    if (password.length < PasswordConstraints.password.min) throw new ValidationException();

    if (password.length > PasswordConstraints.password.max) throw new ValidationException();

    if (!letterRegex.test(password)) throw new ValidationException();

    if (!digitRegex.test(password)) throw new ValidationException();
  }
}
