import { DaysService } from '@app/days';
import { MailService, WebPushService } from '@app/mail';
import { Language } from '@app/users/enums';
import { UsersService } from '@app/users';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RemindersCronService {
  private readonly logger = new Logger(RemindersCronService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly daysService: DaysService,
    private readonly mailService: MailService,
    private readonly webPushService: WebPushService,
  ) {}

  @Cron('* * * * *')
  async runReminders(): Promise<void> {
    const users = await this.usersService.getUsersWithRemindersEnabled();
    if (users.length === 0) return;

    for (const user of users) {
      try {
        await this.processUserReminder(user);
      } catch (err) {
        this.logger.warn(
          `Reminder failed for user ${user._id}`,
          err instanceof Error ? err.message : String(err),
        );
      }
    }
  }

  private async processUserReminder(user: {
    _id: import('mongoose').Types.ObjectId;
    email: string;
    settings: {
      reminders?: {
        enabled: boolean;
        time?: string;
        timezone?: string;
        channels?: { push?: boolean; email?: boolean };
        lastSentAt?: Date | null;
      };
      language?: string;
    };
  }): Promise<void> {
    const reminders = user.settings?.reminders;
    if (!reminders?.enabled) return;

    const tz = reminders.timezone ?? 'Europe/Warsaw';
    const reminderTime = reminders.time ?? '20:00';
    const nowInTz = this.getTimeInTimezone(tz);
    if (nowInTz !== reminderTime) return;

    const todayInTz = this.getTodayDateInTimezone(tz);
    const lastSentAt = reminders.lastSentAt;
    if (lastSentAt && this.isSameDayInTimezone(lastSentAt, todayInTz, tz)) return;

    const userId = user._id.toString();
    const day = await this.daysService.getByDate(userId, todayInTz);
    if (day && day.totalCalories > 0) return;

    await this.usersService.setRemindersLastSentAt(userId, new Date());

    const language =
      (user.settings?.language as Language) ?? Language.EN;

    const channels = reminders.channels ?? { push: false, email: false };
    if (channels.email) {
      try {
        await this.mailService.sendFoodReminder(user.email, language);
      } catch (err) {
        this.logger.warn(`Food reminder email failed for ${user.email}`, err);
      }
    }

    if (channels.push) {
      const subscriptions = await this.usersService.getPushSubscriptionsForUser(userId);
      for (const sub of subscriptions) {
        try {
          await this.webPushService.sendFoodReminderPush(sub, language);
        } catch (err) {
          this.logger.warn(`Food reminder push failed for user ${userId}`, err);
        }
      }
    }
  }

  private getTimeInTimezone(tz: string): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  private getTodayDateInTimezone(tz: string): string {
    return new Date().toLocaleDateString('sv-SE', { timeZone: tz });
  }

  private isSameDayInTimezone(date: Date, dateStr: string, tz: string): boolean {
    const d = date instanceof Date ? date : new Date(date);
    const str = d.toLocaleDateString('sv-SE', { timeZone: tz });
    return str === dateStr;
  }
}
