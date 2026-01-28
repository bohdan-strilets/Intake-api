import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      signOptions: { algorithm: 'HS256' },
    }),
  ],
  exports: [JwtModule],
})
export class GlobalJwtModule {}
