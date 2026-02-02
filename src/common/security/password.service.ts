import { Injectable } from '@nestjs/common';

import { CryptoService } from '../crypto/crypto.service';
import { PasswordPolicy } from './password.policy';

@Injectable()
export class PasswordService {
  constructor(private readonly crypto: CryptoService) {}

  async hash(password: string): Promise<string> {
    PasswordPolicy.validate(password);
    return this.crypto.hash(password);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return this.crypto.compare(password, hash);
  }
}
