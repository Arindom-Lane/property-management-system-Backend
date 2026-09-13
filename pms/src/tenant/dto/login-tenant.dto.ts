import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginTenantDto {
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;

   @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}