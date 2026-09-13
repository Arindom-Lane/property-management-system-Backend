import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {

    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    @MinLength(4)
    newPassword: string;

}