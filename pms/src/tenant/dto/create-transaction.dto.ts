import {
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';

import {
  Transaction_type,
} from 'src/landlord/entities/transaction.entity';


export class CreateTransactionDto {

  @IsEnum(Transaction_type)
  type: Transaction_type;

  @IsOptional()
  @IsNumber()
  amount?: number;
}