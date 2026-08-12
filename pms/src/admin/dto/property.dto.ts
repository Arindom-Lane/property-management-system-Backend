import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional,} from 'class-validator';
import { ListingStatus, Status,} from 'src/landlord/entities/property.entity';

export class CreatePropertyDto {

  @IsNotEmpty()
  unit_number: string;

  @IsNumber()
  buildingId: number;

  @IsNumber()
  landlordId: number;

  @IsNumber()
  rent_amount: number;

  @IsOptional()
  @IsNumber()
  service_charge?: number;

  @IsBoolean()
  has_parking: boolean;

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