import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateWorkOrderDto {
  // Plain uuid for now — there's no Property table in the project yet.
  // Make one up for testing, e.g. any valid uuid string.
  @IsUUID()
  propertyId: string;

  // Would normally come from the JWT (the logged-in landlord). Until auth
  // exists, pass it explicitly so you can test with different "callers".
  @IsUUID()
  requestedById: string;

  // Would normally be looked up from the Property's current tenant.
  // Until a Property/Lease table exists, the caller names the tenant.
  @IsUUID()
  tenantId: string;

  // Would normally be auto-assigned to whichever service_staff has the
  // fewest active jobs. Until a Users table exists to query by role,
  // pass it explicitly.
  @IsUUID()
  assignedStaffId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;
}
