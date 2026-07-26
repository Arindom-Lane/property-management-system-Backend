import { IsEnum, IsNumber, IsOptional,Min } from "class-validator";
export enum orderStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending",
  done = "complete"
}

export class CreateWorkOrderDto {

  @IsEnum(orderStatus, { message: 'workStatus must be active or inactive' })
  workStatus?: orderStatus;

  @IsNumber()
  @Min(0)
  labor_cost: number;

  @IsNumber()
  @Min(0)
  materials_cost: number;

  @IsNumber()
  workerId: number;
}
