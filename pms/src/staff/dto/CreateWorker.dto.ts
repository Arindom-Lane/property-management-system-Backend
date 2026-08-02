// create-worker.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
} from 'class-validator';

import { WorkerStatus } from '../entities/worker.entity';


export class CreateWorkerDto {


  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name can only contain letters and spaces',
  })
  name: string;



  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;



  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;



  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Worker area can only contain letters and spaces',
  })
  worker_area: string;



  @IsEnum(WorkerStatus)
  @IsOptional()
  status?: WorkerStatus;



  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  created_by: number;

}