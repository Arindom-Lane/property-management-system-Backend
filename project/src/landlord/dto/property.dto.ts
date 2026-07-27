import { IsBoolean, IsDateString, IsEmail, isEmpty, IsEmpty, IsEnum, IsInt, IsMobilePhone, IsNotEmpty, IsNumber, isNumber, IsOptional, IsPhoneNumber, isPhoneNumber, IsString, IsUUID, Length, Max, MaxLength, Min } from 'class-validator';
import { CreateDateColumn } from 'typeorm/browser/decorator/columns/CreateDateColumn.js';
import { UpdateDateColumn } from 'typeorm/browser/decorator/columns/UpdateDateColumn.js';


export class propertyDto {
    @IsNumber()
    floor_number?: number;

    @IsString()
    @MaxLength(20)
    house_number?: string;

    @IsString()
    @MaxLength(255)
    house_type?: string;

    @IsNumber()
    price?: number;

    @IsString()
    @IsEnum(['pending', 'active', 'rejected'])
    status?: 'pending' | 'active' | 'rejected';
}