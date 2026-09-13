import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: NestMailerService) {}

  async sendAccountCreatedMail(
    email: string,
    name: string,
    accountType: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Property Management System account was created',
        text: [
          `Hello ${name},`,
          '',
          `An administrator has created a ${accountType} account for you in the Property Management System.`,
          '',
          'You can now sign in using the email address registered for your account.',
          'For security, your password is not included in this email.',
          'Please contact the administrator if you need your login credentials.',
          '',
          'Regards,',
          'Property Management System',
        ].join('\\n'),
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2>Your account has been created</h2>
            <p>Hello ${this.escapeHtml(name)},</p>
            <p>
              An administrator has created a <strong>${this.escapeHtml(accountType)}</strong>
              account for you in the Property Management System.
            </p>
            <p>
              You can now sign in using the email address registered for your account.
            </p>
            <p>
              For security, your password is not included in this email.
              Please contact the administrator if you need your login credentials.
            </p>
            <p>Regards,<br>Property Management System</p>
          </div>
        `,
      });
    } catch (error) {
      // The account has already been created, so mail failure should not undo it.
      this.logger.error(`Could not send account notification to ${email}`, error);
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
