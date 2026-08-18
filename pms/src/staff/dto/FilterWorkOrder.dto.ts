import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/work_order.entity';

export class FilterWorkOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) workerId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) propertyId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) landlordId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) tenantId?: number;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 10;
  @IsOptional() @IsString() sortBy?: string = 'created_at';
  @IsOptional() @IsString() sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
