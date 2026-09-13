import { IsNumber, IsOptional, Min } from 'class-validator';

export class CompleteWorkOrderDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  labor_cost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  materials_cost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  additional_cost?: number;
}