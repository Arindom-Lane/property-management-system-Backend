import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { LandlordStatus } from '../entities/landlord.entity';

export class LandlordDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsMobilePhone()
  phone: string;

  @IsString()
  password_hash: string;

  @IsEnum(LandlordStatus)
  status: LandlordStatus;


}