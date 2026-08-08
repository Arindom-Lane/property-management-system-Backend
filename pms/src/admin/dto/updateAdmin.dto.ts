import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateAdminDto {

  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

}