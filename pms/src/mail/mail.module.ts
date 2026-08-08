import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'riajaiub9@gmail.com',
          pass: 'lyki ghry mprx iihx',
        },
      },
    }),
  ],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}