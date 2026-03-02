import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as path from 'path';

export const RESET_PASSWORD_SUBJECT = 'Reset your password';
export const VERIFICATION_SUBJECT = 'Verify your email';

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
    const stylesPath = path.join(this.partialsDir, 'styles.hbs');
    const stylesSource = fs.readFileSync(stylesPath, 'utf-8');
    Handlebars.registerPartial('styles', stylesSource);
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
