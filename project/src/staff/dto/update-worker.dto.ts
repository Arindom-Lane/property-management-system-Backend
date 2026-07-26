import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateWorkerDto } from './create-worker.dto';
import { WorkerStatus } from '../entities/worker.entity';

// PartialType makes every field from CreateWorkerDto optional, so a PATCH
// can send just the field(s) it wants to change.
export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsOptional()
  @IsEnum(WorkerStatus)
  status?: WorkerStatus;
}
