import { CreateWorkerDto } from './CreateWorker.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { WorkerStatus } from '../entities/worker.entity';

export class UpdateWorkerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() worker_area?: string;
  @IsOptional() @IsEnum(WorkerStatus) status?: WorkerStatus;
}
