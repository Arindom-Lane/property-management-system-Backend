import { IsBoolean, IsEnum, IsNumber, IsOptional,} from 'class-validator';

import { ListingStatus, Status, } from 'src/landlord/entities/property.entity';

export class UpdatePropertyDto {

  @IsOptional()
  unit_number?: string;

  @IsOptional()
  @IsNumber()
  buildingId?: number;

  @IsOptional()
  @IsNumber()
  landlordId?: number;

  @IsOptional()
  @IsNumber()
  rent_amount?: number;

  @IsOptional()
  @IsNumber()
  service_charge?: number;

  @IsOptional()
  @IsBoolean()
  has_parking?: boolean;

  @IsOptional()
  @IsNumber()
  parking_fee?: number;

  @IsOptional()
  @IsEnum(ListingStatus)
  listing_status?: ListingStatus;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}