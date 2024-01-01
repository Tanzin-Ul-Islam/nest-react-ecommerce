import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from 'src/shared/schema/users';
import { MailService } from 'src/core/mail/mail.service';
import { JwtAuthService } from 'src/core/jwt/jwt-auth.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, MailService, JwtAuthService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class UsersModule { }
