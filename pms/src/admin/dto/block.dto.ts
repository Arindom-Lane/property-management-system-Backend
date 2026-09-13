import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBlockDto {

    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    @MaxLength(255)
    address: string;
}