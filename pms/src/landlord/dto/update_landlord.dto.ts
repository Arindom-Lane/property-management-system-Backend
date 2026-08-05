import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { LandlordStatus } from '../entities/landlord.entity';

export class UpdateLandlordDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsMobilePhone()
  @IsOptional()
  phone: string;

  @IsEnum(LandlordStatus)
  @IsOptional()
  status: LandlordStatus;


}