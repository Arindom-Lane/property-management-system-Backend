import { IsEmail, IsNotEmpty, IsString, MinLength, } from 'class-validator';

export class CreateLandlordDto {

  @IsNotEmpty()
  @IsString()
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