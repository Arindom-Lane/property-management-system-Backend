import { IsEnum, IsOptional } from 'class-validator';
import { ComplaintStatus } from '../entities/complaint.entity';

export class UpdateComplaintStatusDto {

    @IsEnum(ComplaintStatus)
    status: ComplaintStatus;

    @IsOptional()
    admin_note?: string;
}
