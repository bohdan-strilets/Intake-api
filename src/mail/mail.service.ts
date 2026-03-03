import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import type { SendEmailParams } from './mail.types';
import {
  ACCOUNT_DELETED_SUBJECT,
  ACCOUNT_RESTORED_SUBJECT,
  EMAIL_CHANGED_SUBJECT,
  MailTemplateService,
  PASSWORD_CHANGED_SUBJECT,
  RESET_PASSWORD_SUBJECT,
  VERIFICATION_SUBJECT,
} from './mail-template.service';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly mailFrom: string;
  private readonly appUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly templateService: MailTemplateService,
  ) {
    this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
    this.mailFrom = this.config.getOrThrow<string>('MAIL_FROM');
    this.appUrl = this.config.getOrThrow<string>('APP_URL').replace(/\/$/, '');
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${this.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const { html, text } = this.templateService.renderResetPassword(resetUrl);

    await this.sendEmail({ to, subject: RESET_PASSWORD_SUBJECT, html, text });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verifyUrl = `${this.appUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const { html, text } = this.templateService.renderVerification(verifyUrl);

    await this.sendEmail({ to, subject: VERIFICATION_SUBJECT, html, text });
  }

  async sendPasswordChangedNotification(to: string): Promise<void> {
    const { html, text } = this.templateService.renderPasswordChanged();
    await this.sendEmail({ to, subject: PASSWORD_CHANGED_SUBJECT, html, text });
  }

  async sendEmailChangedNotification(toOldEmail: string, newEmail: string): Promise<void> {
    const { html, text } = this.templateService.renderEmailChanged(newEmail);
    await this.sendEmail({
      to: toOldEmail,
      subject: EMAIL_CHANGED_SUBJECT,
      html,
      text,
    });
  }

  async sendAccountDeletedNotification(to: string): Promise<void> {
    const { html, text } = this.templateService.renderAccountDeleted();
    await this.sendEmail({ to, subject: ACCOUNT_DELETED_SUBJECT, html, text });
  }

  async sendAccountRestoredNotification(to: string): Promise<void> {
    const { html, text } = this.templateService.renderAccountRestored();
    await this.sendEmail({ to, subject: ACCOUNT_RESTORED_SUBJECT, html, text });
  }

  private async sendEmail({ to, subject, html, text }: SendEmailParams): Promise<void> {
    try {
      const result = await this.resend.emails.send({
        from: this.mailFrom,
        to,
        subject,
        html,
        text: text ?? html.replace(/<[^>]*>/g, ''),
      });

      if (result.error) {
        throw new InternalServerErrorException('Failed to send email');
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
