import { IsBoolean, IsEmail, IsNotEmpty, MinLength, } from 'class-validator';

export class CreateTenantDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  nid_number: string;

  @IsNotEmpty()
  nid_document_url: string;

  @IsBoolean()
  has_vehicle: boolean;
}