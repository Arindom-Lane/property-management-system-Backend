import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class AdminDto {

    @IsString()
    name: string;

    @IsNumber()
    block_id: number;

    @IsString()
    created_by: string;

    @IsDate()
    created_at: Date;
}