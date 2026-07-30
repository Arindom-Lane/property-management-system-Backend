import { IsBoolean, IsDate, IsEnum, IsMobilePhone, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserStatus } from '../entities/landlord.entity';


export class LandlordDto {

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsMobilePhone()
    Phone: string;

    @IsString()
    password_hash: string;


    @IsEnum(UserStatus)
    @IsString()
    status: string;

    @IsString()
    created_by: string;


    @IsDate()
    created_at: Date;
}