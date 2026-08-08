import { IsEmail, IsOptional, IsString, } from 'class-validator';

export class UpdateLandlordDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

}