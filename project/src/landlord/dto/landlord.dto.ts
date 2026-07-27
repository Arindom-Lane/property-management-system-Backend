import { IsBoolean, IsDateString, IsEmail, isEmpty, IsEmpty, IsEnum, IsInt, IsMobilePhone, IsNotEmpty, IsNumber, isNumber, IsOptional, IsPhoneNumber, isPhoneNumber, IsString, IsUUID, Length, Max, MaxLength, Min } from 'class-validator';
import { CreateDateColumn } from 'typeorm/browser/decorator/columns/CreateDateColumn.js';
import { UpdateDateColumn } from 'typeorm/browser/decorator/columns/UpdateDateColumn.js';

export class LandlordDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  email?: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone_number?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  address?: string;
}



