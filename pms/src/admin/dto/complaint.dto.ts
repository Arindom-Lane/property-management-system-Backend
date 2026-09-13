import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ComplaintAgainstType } from '../entities/complaint.entity';

export enum FiledByType {
    LANDLORD = 'LANDLORD',
    TENANT = 'TENANT',
    STAFF = 'STAFF',
}

export class CreateComplaintDto {

    @IsEnum(FiledByType)
    filed_by_type: FiledByType;

    @IsNotEmpty()
    @IsInt()
    filed_by_id: number;

    @IsEnum(ComplaintAgainstType)
    against_type: ComplaintAgainstType;

    @IsOptional()
    @IsInt()
    against_id?: number;

    @IsNotEmpty()
    description: string;
}
