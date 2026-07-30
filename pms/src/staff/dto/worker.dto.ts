// create-worker.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { WorkerStatus } from '../entities/worker.entity'; 

export class CreateWorkerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    worker_area?: string;

    @IsEnum(WorkerStatus)
    status?: WorkerStatus;

    @IsNumber()
    @IsNotEmpty()
    created_by: number;
}