import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Scope } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    async sendMail(sendTo: string, subject: string, templateName: string, payload: any): Promise<void> {
        try {
            // Send email and await the result
            await this.mailerService.sendMail({
                to: sendTo,
                from: process.env.MAILUSER,
                subject: subject,
                template: templateName,
                context: payload,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            // Handle the error as needed (e.g., logging, returning a specific response)
            throw error;
        }
    }
}