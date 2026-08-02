// create-worker.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsAlpha,
  Matches,
  IsOptional,
  IsNumber,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { StaffStatus } from '../entities/staff.entity';

export class staffDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @MinLength(6)
  @Matches(/^[a-zA-Z1-9#]+$/, {
    message: 'Only letters (a-z, A-Z), numbers (1-9), and # are allowed',
  })
  password_hash: string;

  @IsNumber()
  @IsOptional()
  created_by: number;

  @IsEnum(StaffStatus)
  status?: StaffStatus;
}
