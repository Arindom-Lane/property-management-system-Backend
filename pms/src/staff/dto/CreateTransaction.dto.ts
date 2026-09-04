import { IsEnum, IsNumber, IsOptional, IsInt, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction_type, payer_type, status, created_by_type } from 'src/landlord/entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(Transaction_type) type: Transaction_type;
  @IsNumber() @Type(() => Number) amount: number;
  @IsInt() @Type(() => Number) property_id: number;
  @IsOptional() @IsInt() @Type(() => Number) tenant_id?: number;
  @IsOptional() @IsInt() @Type(() => Number) work_order_id?: number;
  @IsEnum(payer_type) payer_type: payer_type;
  @IsOptional() @IsEnum(status) status?: status;
}
