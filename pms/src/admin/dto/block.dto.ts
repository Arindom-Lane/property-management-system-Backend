import { IsBoolean, IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class BlockDto {

    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsString()
    created_by: string;

    @IsDate()
    created_at: Date;
}