import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateBuildingDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  blockId?: number;

}