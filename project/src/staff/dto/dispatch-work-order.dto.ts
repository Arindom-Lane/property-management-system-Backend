import { IsNotEmpty } from "class-validator";

export class DispatchWorkOrderDto {
  @IsNotEmpty()
  workerId: number;
}
