import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ConvertIssueDto {
  // If issue already has property, this is ignored. Required if issue has no property.
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) property_id: number; 
}
