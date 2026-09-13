import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IssueStatus } from '../../tenant/entities/issue.entity';

export class IssueStatusDto {
  @IsEnum(IssueStatus) status: IssueStatus;
  @IsOptional() @IsString() resolutionNotes?: string;
}
