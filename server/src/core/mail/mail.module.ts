import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
@Module({
    providers: [MailService],
    exports: [MailService],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MailerModule.forRoot({
            transport: {
                service: 'Gmail',
                auth: {
                    user: process.env.MAILUSER,
                    pass: process.env.MAILPASSWORD,
                },
                secure: false,
                tls: {
                    ciphers: 'SSLv3',
                },
            },
            // defaults: {
            //     from: "tanzin.cse888@gmail.com",
            // },
            template: {
                dir: join(__dirname, '../../../src/core/mail/templates'),
                adapter: new HandlebarsAdapter(), // You can use other adapters as well
                options: {
                    strict: true,
                },
            },
        }),
    ],
})
export class MailModule { }
