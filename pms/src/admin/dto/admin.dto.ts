import { IsBoolean, IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class AdminDto {

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password_hash: string;

    @IsString()
    created_by: string;


    @IsDate()
    created_at: Date;
}