import { IsEnum, IsNotEmpty, IsOptional, IsString, IsMobilePhone} from "class-validator";
import { WorkerStatus } from "../entities/worker.entity";

export class UpdateWorkerDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsMobilePhone()
  @IsNotEmpty({ message: "Phone number is required" })
  phone?: number;

  @IsOptional()
  @IsEnum(WorkerStatus)
  status?: WorkerStatus;
}
