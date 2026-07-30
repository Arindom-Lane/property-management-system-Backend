// create-worker.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';


export class CreateWorkerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    worker_area: string;

    @IsOptional()
    @IsEnum(StaffStatus)
    status?: StaffStatus;

    // We only need the ID of the staff member who created this worker
    @IsNumber()
    @IsNotEmpty()
    created_by: number;
}