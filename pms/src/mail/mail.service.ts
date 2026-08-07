import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  // Welcome Mail
async sendWelcomeMail(email: string, name: string) {
  try {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome',
      html: `<h2>Hello ${name}</h2>`,
    });

    console.log('Mail sent successfully');
  } catch (error) {
    console.log(error);
  }
}

  // Payment Mail
  async sendPaymentMail(
    email: string,
    name: string,
    amount: number,
    transaction: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Rent Payment Successful',

      html: `
      <h2>Hello ${name}</h2>

      <p>Your payment has been received.</p>

      <b>Amount:</b> ${amount}<br>

      <b>Transaction:</b> ${transaction}
      `,
    });
  }
}