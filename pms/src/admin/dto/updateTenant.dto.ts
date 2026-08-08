import { IsBoolean, IsEmail, IsOptional, } from 'class-validator';

export class UpdateTenantDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  nid_number?: string;

  @IsOptional()
  nid_document_url?: string;

  @IsOptional()
  @IsBoolean()
  has_vehicle?: boolean;

}