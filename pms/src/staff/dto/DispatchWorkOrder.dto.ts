import {
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class DispatchWorkerDto {

  @IsNumber()
  @IsNotEmpty()
  worker_id: number;

}