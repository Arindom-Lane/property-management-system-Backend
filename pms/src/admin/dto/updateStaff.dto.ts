import { IsEmail, IsOptional, } from 'class-validator';

export class UpdateStaffDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

}