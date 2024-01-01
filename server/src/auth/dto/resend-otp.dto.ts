import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendOtp {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}