import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    oldPassword: string;
    @IsNotEmpty()
    newPassword: string;
}