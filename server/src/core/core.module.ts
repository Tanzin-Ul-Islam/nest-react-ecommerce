import { Global, Module } from "@nestjs/common";
import { MailModule } from "./mail/mail.module";
import { JwtAuthModule } from "./jwt/jwt-auth.module";

@Global()
@Module({
    imports: [
        MailModule,
        JwtAuthModule,
    ],
    exports: [
        MailModule,
        JwtAuthModule,
    ],
    providers: []
})
export class CoreModule { }