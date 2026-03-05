import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webPush from 'web-push';

import { Language } from '@app/users/enums';
import { getFoodReminderContent } from './reminder-i18n';

export interface PushSubscriptionPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushMessagePayload {
  title: string;
  body: string;
}

@Injectable()
export class WebPushService {
  private readonly logger = new Logger(WebPushService.name);
  private vapidInitialized = false;

  constructor(private readonly config: ConfigService) {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.config.get<string>('VAPID_PRIVATE_KEY');
    if (publicKey && privateKey) {
      webPush.setVapidDetails('mailto:support@intake.app', publicKey, privateKey);
      this.vapidInitialized = true;
    } else {
      this.logger.warn('VAPID keys not set; push notifications will not be sent');
    }
  }

  async sendPush(
    subscription: PushSubscriptionPayload,
    payload: PushMessagePayload,
  ): Promise<void> {
    if (!this.vapidInitialized) {
      this.logger.warn('Skipping push: VAPID not initialized');
      return;
    }
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };
    try {
      await webPush.sendNotification(
        pushSubscription,
        JSON.stringify(payload),
        {
          TTL: 86400, // 24h — helps push services (e.g. APNs on iOS) retain and deliver
          urgency: 'high',
        },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const statusCode = err && typeof err === 'object' && 'statusCode' in err ? (err as { statusCode: number }).statusCode : undefined;
      this.logger.warn(
        `Push send failed${statusCode != null ? ` (${statusCode})` : ''}: ${msg}`,
      );
      throw err;
    }
  }

  async sendFoodReminderPush(
    subscription: PushSubscriptionPayload,
    language: Language,
  ): Promise<void> {
    const { pushTitle, pushBody } = getFoodReminderContent(language);
    await this.sendPush(subscription, { title: pushTitle, body: pushBody });
  }
}