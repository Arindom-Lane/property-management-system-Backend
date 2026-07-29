import { IsEnum, IsNumber, IsOptional,IsString,Min } from "class-validator";
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
  labor_cost?: number;

  @IsNumber()
  @Min(0)
  materials_cost?: number;

  @IsNumber()
  @IsOptional()
  workerId?: number;

  @IsNumber()
  property_id?: number;

  @IsString()
  issue?: string;

}
