import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export enum AccountType {
  ADMIN = 'admin',
  STAFF = 'staff',
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}

export class LoginDto {
  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
