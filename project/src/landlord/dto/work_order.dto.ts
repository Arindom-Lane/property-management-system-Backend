import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateWorkOrderDto {
    
  @IsInt({ message: 'Issue ID must be an integer.' })
  @IsNotEmpty({ message: 'Issue ID is required.' })
  issue_id?: number;

  @IsInt({ message: 'Requester ID must be an integer.' })
  @IsNotEmpty({ message: 'Requester ID is required.' })
  requester_id?: number;

  @IsInt({ message: 'Assigned Staff ID must be an integer.' })
  @IsOptional()
  assigned_staff_id?: number;

  @IsInt({ message: 'Worker ID must be an integer.' })
  @IsOptional()
  worker_id?: number;

  @IsInt({ message: 'Category ID must be an integer.' })
  @IsNotEmpty({ message: 'Category ID is required.' })
  category_id?: number;

  @IsIn(
    ['requested', 'dispatched', 'tenant_confirmed', 'completed'],
    {
      message:
        'Status must be one of: requested, dispatched, tenant_confirmed, completed.',
    },
  )
  @IsOptional()
  status?: 'requested' | 'dispatched' | 'tenant_confirmed' | 'completed';

  @IsEmpty({ message: 'tenant_confirmed_at is generated automatically.' })
  tenant_confirmed_at?: Date;

  @IsEmpty({ message: 'completed_at is generated automatically.' })
  completed_at?: Date;

  @IsNumber({}, { message: 'Labor cost must be a number.' })
  @IsOptional()
  labor_cost?: number;

  @IsNumber({}, { message: 'Material cost must be a number.' })
  @IsOptional()
  material_cost?: number;

  @IsEmpty({ message: 'created_at is generated automatically.' })
  created_at?: Date;
}