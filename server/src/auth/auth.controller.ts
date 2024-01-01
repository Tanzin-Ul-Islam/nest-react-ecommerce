import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtp } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Get('/verify-email/:email/:otp')
  verifyEmail(@Param() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Get('/resend-otp/:email')
  resendOtp(@Param() resendOtp: ResendOtp) {
    return this.authService.resendOtp(resendOtp);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authCredential: AuthDto, @Res({ passthrough: true }) res: Response) {
    const loginResponse = await this.authService.signIn(authCredential);
    const { success, message, tokens } = loginResponse;
    const { accessToken, refreshToken } = tokens;
    if (loginResponse.success) {
      res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'none', secure: true });
      res.status(200).send({ success: success, message: message, accessToken: accessToken });
    } else {
      throw new Error('Something went wrong! Please try again!');
    }

  }

  @Get('/forgot-password/:email')
  forgotPassword(@Param() forgotPasswordDto: ForgotPasswordDto){
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post('/update-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto){
    return this.authService.updatePassword(updatePasswordDto);
  }
}
