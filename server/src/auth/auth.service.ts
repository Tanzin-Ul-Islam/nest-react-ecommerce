import { Inject, Injectable } from '@nestjs/common';
import { JwtAuthService } from 'src/core/jwt/jwt-auth.service';
import { MailService } from 'src/core/mail/mail.service';
import { UserRepository } from 'src/users/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { userTypes } from 'src/shared/schema/users';
import { compareHash, hashPassword } from 'src/utils/bcrypt.utils';
import { userTransformer } from 'src/transformers/user.transformer';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtp } from './dto/resend-otp.dto';
import { AuthDto } from './dto/auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtAuthService: JwtAuthService,
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) { }
  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.userDB.findOne({
        email: createUserDto.email,
      })
      if (user) {
        throw new Error("User already exist!")
      }
      if (createUserDto.type === userTypes.ADMIN && createUserDto.secretToken !== process.env.ADMIN_SECRET_TOKEN) {
        throw new Error('Not allowed to create admin.');
      } else if (createUserDto.type != userTypes.CUSTOMER) {
        createUserDto.isVerified = true;
      } else {
        createUserDto.isVerified = false;
      }
      createUserDto.password = await hashPassword(createUserDto.password);
      const otp = (Math.floor(Math.random() * 900000) + 100000);
      const otpExpireyTime = new Date();
      otpExpireyTime.setMinutes(otpExpireyTime.getMinutes() + 10);
      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpireyTime,
      });
      const mailPayLoad = {
        name: newUser.name,
        otpCode: otp,
      }
      if (newUser.type !== userTypes.ADMIN) {
        await this.mailService.sendMail('tanzin.8897@gmail.com', 'Verify email', 'mail-verification', mailPayLoad);
      }
      return {
        success: true,
        message: newUser.type != userTypes.ADMIN ? 'Admin created successfully.' : 'Please verify your email to activate account.',
        result: userTransformer(newUser),
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const { email, otp } = verifyEmailDto;
      const user = await this.userDB.findOne({
        email: email,
      });
      if (!user) {
        throw new Error("User not found!");
      }
      if (user.otp != otp) {
        throw new Error("Invalid otp!");
      }
      const otpExpiryTime = new Date(user.otpExpireyTime);
      const currentTime = new Date();
      if (currentTime > otpExpiryTime) {
        throw new Error("Otp expired!");
      }
      user.isverfied = true;
      await this.userDB.updateOne({ email }, { isverfied: true });
      return {
        success: true,
        message: "Email verified successfully.",
        result: user.email,
      };
    } catch (error) {
      throw error
    }
  }

  async resendOtp(resendOtp: ResendOtp) {
    try {
      const { email } = resendOtp;
      const user = await this.userDB.findOne({
        email: email,
      });
      if (!user) {
        throw new Error("User not found!");
      }
      if (user.isverfied) {
        throw new Error("Email already verified!");
      }
      const otp = (Math.floor(Math.random() * 900000) + 100000);
      const otpExpireyTime = new Date();
      otpExpireyTime.setMinutes(otpExpireyTime.getMinutes() + 10);
      await this.userDB.updateOne({ email }, { otp: otp, otpExpireyTime: otpExpireyTime });
      const mailPayLoad = {
        name: user.name,
        otpCode: otp,
      }
      await this.mailService.sendMail('tanzin.8897@gmail.com', 'Verify email', 'mail-verification', mailPayLoad);
      return {
        success: true,
        message: "Otp sent successfully.",
        result: user.email,
      };
    } catch (error) {
      throw error
    }
  }

  async signIn(authCredential: AuthDto) {
    try {
      const { email, password } = authCredential;
      const user = await this.userDB.findOne({
        email: email,
      })
      if (!user) {
        throw new Error('user not created!');
      } else if (!user.isverfied) {
        throw new Error('Please verify your email.');
      }

      const comparePassword = await compareHash(password, user.password);
      if (!comparePassword) {
        throw new Error('Wrong password!');
      }

      const jwtPayload = {
        id: user.id,
        email: user.email
      }
      const { accessToken, refreshToken } = this.jwtAuthService.generateJwtTokens(jwtPayload);
      return {
        success: true,
        message: "Successfully Logged In",
        tokens: { accessToken, refreshToken },
      }
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const { email } = forgotPassword;
    const user = await this.userDB.findOne({
      email: email,
    });
    if (!user) {
      throw new Error("User not found!")
    }
    let tempPassword = Math.random().toString(36).substring(2, 12);
    const password = await hashPassword(tempPassword);
    await this.userDB.updateOne({ _id: user.id }, { password: password });
    const mailPayLoad = {
      name: user.name,
      tempPassword: tempPassword,
    }
    await this.mailService.sendMail('tanzin.8897@gmail.com', 'Forgot password', 'forgot-password', mailPayLoad);
    return {
      success: true,
      message: "Email for temporary password send successfully"
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { id, oldPassword, newPassword } = updatePasswordDto;
    const user = await this.userDB.findOne({
      _id: id
    });
    if (!user) {
      throw new Error("User not found!")
    }
    const comparePassword = await compareHash(oldPassword, user.password);
    if (!comparePassword) {
      throw new Error("Password did not matched");
    }
    const newHashPassword = await hashPassword(newPassword);
    await this.userDB.updateOne({ _id: user.id }, { password: newHashPassword });
    return {
      success: true,
      message: "Password updated successfully.",
      result: userTransformer(user),
    }
  }
}
