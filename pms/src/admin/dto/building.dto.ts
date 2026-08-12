import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBuildingDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  blockId: number;

}