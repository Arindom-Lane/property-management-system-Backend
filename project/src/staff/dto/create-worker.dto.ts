import { IsEnum, IsNotEmpty, IsOptional, IsString, IsPhoneNumber, IsMobilePhone, isPhoneNumber } from 'class-validator';
import { WorkerStatus } from '../entities/worker.entity'; 

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker name is required' })
  name: string;

  @IsMobilePhone()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsOptional()
  @IsEnum(WorkerStatus, { message: 'Status must be available, busy, or inactive' })
  status?: WorkerStatus;
}