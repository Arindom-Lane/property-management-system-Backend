import { IsEmail, IsNotEmpty, MinLength, } from 'class-validator';

export class CreateStaffDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}