import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { MailService } from 'src/core/mail/mail.service';
import { JwtAuthService } from 'src/core/jwt/jwt-auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtAuthService: JwtAuthService,
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) { }

}
