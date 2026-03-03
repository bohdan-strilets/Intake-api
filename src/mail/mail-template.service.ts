import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as path from 'path';

export const RESET_PASSWORD_SUBJECT = 'Reset your password';
export const VERIFICATION_SUBJECT = 'Verify your email';
export const PASSWORD_CHANGED_SUBJECT = 'Your password was changed';
export const EMAIL_CHANGED_SUBJECT = 'Your email address was changed';
export const ACCOUNT_DELETED_SUBJECT = 'Your account was deleted';
export const ACCOUNT_RESTORED_SUBJECT = 'Your account was restored';

@Injectable()
export class MailTemplateService {
  private readonly templatesDir: string;
  private readonly partialsDir: string;

  private compiled = new Map<string, Handlebars.TemplateDelegate>();

  constructor() {
    this.templatesDir = path.join(__dirname, 'templates');
    this.partialsDir = path.join(this.templatesDir, 'partials');
    this.registerPartials();
  }

  private registerPartials(): void {
    const partials = ['styles', 'email-header', 'email-footer'];
    for (const name of partials) {
      const filePath = path.join(this.partialsDir, `${name}.hbs`);
      const source = fs.readFileSync(filePath, 'utf-8');
      Handlebars.registerPartial(name, source);
    }
  }

  renderResetPassword(resetUrl: string): { html: string; text: string } {
    return {
      html: this.compileAndRender('auth/reset-password.html', { resetUrl }),
      text: this.compileAndRender('auth/reset-password.text', { resetUrl }),
    };
  }

  renderVerification(verifyUrl: string): { html: string; text: string } {
    return {
      html: this.compileAndRender('auth/verification.html', { verifyUrl }),
      text: this.compileAndRender('auth/verification.text', { verifyUrl }),
    };
  }

  renderPasswordChanged(): { html: string; text: string } {
    return {
      html: this.compileAndRender('auth/password-changed.html', {}),
      text: this.compileAndRender('auth/password-changed.text', {}),
    };
  }

  renderEmailChanged(newEmail: string): { html: string; text: string } {
    return {
      html: this.compileAndRender('auth/email-changed.html', { newEmail }),
      text: this.compileAndRender('auth/email-changed.text', { newEmail }),
    };
  }

  renderAccountDeleted(): { html: string; text: string } {
    return {
      html: this.compileAndRender('auth/account-deleted.html', {}),
      text: this.compileAndRender('auth/account-deleted.text', {}),
    };
  }

  renderAccountRestored(): { html: string; text: string } {
    return {
      html: this.compileAndRender('auth/account-restored.html', {}),
      text: this.compileAndRender('auth/account-restored.text', {}),
    };
  }

  private compileAndRender(name: string, context: Record<string, string>): string {
    const cacheKey = name;
    let template = this.compiled.get(cacheKey);

    if (!template) {
      const filePath = path.join(this.templatesDir, `${name}.hbs`);
      const source = fs.readFileSync(filePath, 'utf-8');
      template = Handlebars.compile(source);
      this.compiled.set(cacheKey, template);
    }

    return template(context);
  }
}
