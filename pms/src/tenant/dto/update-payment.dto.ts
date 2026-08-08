import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  transaction_id?: string;
}