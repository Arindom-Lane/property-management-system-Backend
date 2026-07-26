import { IsNumber, Min } from 'class-validator';

export class CompleteWorkOrderDto {
  @IsNumber()
  @Min(0)
  laborCost: number;

  @IsNumber()
  @Min(0)
  materialsCost: number;
}
