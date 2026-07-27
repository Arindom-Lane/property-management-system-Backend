import { IsBoolean, IsDateString, IsEmail, isEmpty, IsEmpty, IsEnum, IsInt, IsMobilePhone, IsNotEmpty, IsNumber, isNumber, IsOptional, IsPhoneNumber, isPhoneNumber, IsString, IsUUID, Length, Max, MaxLength, Min } from 'class-validator';
import { CreateDateColumn } from 'typeorm/browser/decorator/columns/CreateDateColumn.js';
import { UpdateDateColumn } from 'typeorm/browser/decorator/columns/UpdateDateColumn.js';

export class CreateLandlordDto {
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
export class CreatePropertyDto {
  @IsNumber()
  building_id?: number;

  @IsInt()
  floor_number?: number;

  @IsString()
  @MaxLength(10)
  house_number?: string;

  @IsEnum(['rent', 'sale'])
  type?: 'rent' | 'sale';

  @IsNumber()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  amenities?: string;
}


export class ApproveLeaseDto {
  @IsEnum(['approved', 'rejected'])
  status?: 'approved' | 'rejected';
}

export class CreateWorkOrderDto {
  @IsInt()
  issue_id?: number;

  @IsInt()
  category_id?: number;

  @IsEnum(['low', 'medium', 'high', 'urgent'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @IsNumber()
  @IsOptional()
  estimated_cost?: number;
}


export class TransactionFilterDto {
  @IsOptional()
  @IsEnum(['rent', 'service_fee', 'purchase'])
  type?: 'rent' | 'service_fee' | 'purchase';

  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed'])
  status?: 'pending' | 'completed' | 'failed';

  @IsOptional()
  @IsDateString()
  from_date?: string;

  @IsOptional()
  @IsDateString()
  to_date?: string;
}