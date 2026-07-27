import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CompleteWorkOrderDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  labor_cost: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  materials_cost: number;
} 