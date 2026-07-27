import { IsEnum, IsNotEmpty, IsOptional, IsString, IsPhoneNumber, IsMobilePhone } from 'class-validator';
import { WorkerStatus } from '../entities/worker.entity'; 

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker name is required' })
  name: string;

  @IsMobilePhone()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: number;

  @IsOptional()
  @IsEnum(WorkerStatus, { message: 'Status must be available, busy, or inactive' })
  status?: WorkerStatus;
}