import { IsString, IsNumber, IsEmail, IsOptional, IsNotEmpty, isEmail, contains, Contains, MinLength, Matches, IsIn, IsMobilePhone, min, Max, MaxLength } from 'class-validator';

export class staffDataDto {

    @Contains('aiub.edu')
    @IsEmail()
    email?: string;

    @Matches(/[A-Z]/)
    @MinLength(6)
    password?: string;

    // @Contains('male')
    // @Contains('female')
    @IsIn(['male','female', 'Male', 'Female'])
    gender?: string;

    @IsMobilePhone()
    @MinLength(11)
    @MaxLength(11)
    phone?: string;

    // @IsString()
    // @IsNotEmpty()
    // name?: string;
    // @IsNumber()
    // @IsNotEmpty()
    // age?: number;
    // @IsEmail()
    // @IsOptional()
    // email?: string;  
    
    
}        