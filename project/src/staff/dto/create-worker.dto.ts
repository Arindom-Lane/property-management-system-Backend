import { IsEnum, IsNotEmpty, IsOptional, IsString,IsMobilePhone } from 'class-validator';
import { Worker } from '../entities/worker.entity';
export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker name is required' })
  name: string;


  @IsMobilePhone()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;


  @IsOptional()
  @IsEnum(Status, { message: 'Status must be active or inactive' })
  status?: Status;
}