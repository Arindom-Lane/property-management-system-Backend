import { Injectable } from '@nestjs/common';
import { MailerService,transporter } from "@nestjs-modules/mailer";


@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendWelcomeMail(email: string, name: string) {

        try {
            await transporter.verify();
            console.log("Server is ready to take our messages");
        } catch (err) {
            console.error("Verification failed:", err);
        }


        await this.mailerService.sendMail({
            to: email,

            subject: "Welcome to Property Management System",

            text: `Hello ${name},

                    Your Staff account has been created successfully.

                    Welcome to our Property Management System.`,
        });
    }


}
