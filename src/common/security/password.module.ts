import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto/crypto.module';
import { PasswordService } from './password.service';

@Module({
  imports: [CryptoModule],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
