import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class VerifyEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp: string;
}