import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';

import { OrderStatus } from '../entities/work_order.entity';


export class CreateWorkOrderDto {


  @IsNumber()
  @IsNotEmpty()
  property_id: number;

  @IsNumber()
  @IsNotEmpty()
  issue_id: number;


  @IsNumber()
  @IsNotEmpty()
  landlord_id: number;


  @IsNumber()
  @IsOptional()
  tenant_id: number;


  @IsNumber()
  @IsOptional()
  staff_id: number;


  @IsNumber()
  @IsOptional()
  worker_id: number;


  @IsNumber()
  @IsOptional()
  review_id?: number;


  @IsString()
  @IsNotEmpty()
  created_by_type: string;


  @IsNumber()
  @IsNotEmpty()
  created_by_id: number;


  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}