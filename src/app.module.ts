import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { EnvModule } from './common/config';
import { DatabaseModule } from './common/database';
import { UsersModule } from './users';

@Module({
  imports: [EnvModule, DatabaseModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
