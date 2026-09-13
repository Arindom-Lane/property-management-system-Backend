import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class LoginAdminDto{

    //@IsNotEmpty()
    //@IsString()
    //name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(4)
    password: string;

}