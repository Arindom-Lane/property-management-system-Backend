import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsInt,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payment_month: string;

  @IsInt()
  payment_year: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsString()
  @IsNotEmpty()
  transaction_id: string;
}