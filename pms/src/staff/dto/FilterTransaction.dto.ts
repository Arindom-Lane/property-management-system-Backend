import { IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction_type, payer_type, status } from 'src/landlord/entities/transaction.entity';

export class FilterTransactionDto {
  @IsOptional() @IsEnum(Transaction_type) type?: Transaction_type;
  @IsOptional() @IsEnum(status) status?: status;
  @IsOptional() @IsEnum(payer_type) payerType?: payer_type;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) propertyId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) workOrderId?: number;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 10;
}
