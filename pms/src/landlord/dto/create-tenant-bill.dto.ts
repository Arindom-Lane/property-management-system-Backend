import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import {
  Transaction_type,
} from '../entities/transaction.entity';

export class CreateTenantBillDto {

  @IsNumber()
  tenantId: number;

  @IsEnum(Transaction_type)
  type: Transaction_type;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  month: string;
}