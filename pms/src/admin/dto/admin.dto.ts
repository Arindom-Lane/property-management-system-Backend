import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class CreateAdminDto{

    @IsNotEmpty()
    @MaxLength(20)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(4)
    password: string;

}