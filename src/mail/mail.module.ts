import { Global, Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { MailTemplateService } from './mail-template.service';
import { WebPushService } from './web-push.service';

@Global()
@Module({
  providers: [MailService, MailTemplateService, WebPushService],
  exports: [MailService, WebPushService],
})
export class MailModule {}
