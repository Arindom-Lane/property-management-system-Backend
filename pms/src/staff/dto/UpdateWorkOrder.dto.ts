import { CreateWorkOrderDto } from './CreateWorkOrder.dto';
import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from '../entities/work_order.entity';

export class UpdateWorkOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  labor_cost?: number;

  @IsOptional()
  @IsNumber()
  materials_cost?: number;

  @IsOptional()
  @IsNumber()
  additional_cost?: number;
}
