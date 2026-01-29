import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Session, SessionSchema } from './schemas';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
