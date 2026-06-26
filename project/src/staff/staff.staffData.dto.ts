import { IsString, IsNumber, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class staffDataDto {
    @IsString()
    @IsNotEmpty()
    name?: string;
    @IsNumber()
    @IsNotEmpty()
    age?: number;
    @IsEmail()
    @IsOptional()
    email?: string;     
}        