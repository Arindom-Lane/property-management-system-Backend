import { IsNotEmpty,IsOptional } from "class-validator";

export class DispatchWorkOrderDto {
  @IsOptional()
  @IsNotEmpty()
  workerId?: number;
}
