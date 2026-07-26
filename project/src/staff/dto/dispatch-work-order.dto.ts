import { IsUUID } from 'class-validator';

export class DispatchWorkOrderDto {
  @IsUUID()
  workerId: string;
}
