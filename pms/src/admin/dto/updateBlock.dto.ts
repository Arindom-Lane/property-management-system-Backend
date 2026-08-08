import { IsOptional, MaxLength } from 'class-validator';

export class UpdateBlockDto {

  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @MaxLength(255)
  address?: string;

}