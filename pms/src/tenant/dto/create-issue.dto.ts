import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}