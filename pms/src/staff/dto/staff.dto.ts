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
  IsMobilePhone,
} from 'class-validator';
import { StaffStatus } from '../entities/staff.entity';

export class staffDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name can only contain letters and spaces',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @MinLength(6)
  @Matches(/^[a-zA-Z1-9#]+$/, {
    message: 'Only letters (a-z, A-Z), numbers (1-9), and # are allowed',
  })
  password_hash: string;


  @IsEnum(StaffStatus)
  status?: StaffStatus;
}
