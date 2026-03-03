import { DaysModule } from '@app/days';
import { MailModule } from '@app/mail';
import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';

import { RemindersCronService } from './reminders-cron.service';

@Module({
  imports: [UsersModule, DaysModule, MailModule],
  providers: [RemindersCronService],
})
export class RemindersModule {}
