import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { BuildingEntity } from 'src/admin/entities/building.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';

export enum ListingStatus {
  not_listed = 'not_listed',
  for_rent = 'for_rent',
  for_sale = 'for_sale',
}

export enum Status {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  SOLD = 'sold',
}

@Entity('property')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit_number: string;

  @ManyToOne(() => BuildingEntity, (building) => building.properties)
  building_id: BuildingEntity;

  @ManyToOne(() => LandlordEntity, (landlord) => landlord.properties)
  landlord: LandlordEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rent_amount: number;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.not_listed,
  })
  listing_status: ListingStatus;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.VACANT,
  })
  status: Status;

  @Column()
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => TenantEntity, (tenant) => tenant.property)
  tenant: TenantEntity;
}
