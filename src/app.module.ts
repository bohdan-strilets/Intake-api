import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { EnvModule } from './common/config';
import { DatabaseModule } from './common/database';
import { GlobalJwtModule } from './common/jwt';
import { UsersModule } from './users';

@Module({
  imports: [EnvModule, DatabaseModule, GlobalJwtModule, AuthModule, UsersModule],
})
export class AppModule {}
