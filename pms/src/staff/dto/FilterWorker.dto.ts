import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkerStatus } from '../entities/worker.entity';

export class FilterWorkerDto {
  @IsOptional() @IsEnum(WorkerStatus) status?: WorkerStatus;
  @IsOptional() @IsString() area?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 10;
}
