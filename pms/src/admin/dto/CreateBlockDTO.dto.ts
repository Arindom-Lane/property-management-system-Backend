import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlockDTO {

    @IsString()
    name: string;

    @IsString()
    address: string;

}