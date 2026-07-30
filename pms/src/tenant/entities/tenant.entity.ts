import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { PropertyEntity } from '../property/property.entity'; // Adjust import path
import { LandlordEntity } from '../landlord/landlord.entity'; // Adjust import path

export enum TenantStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('tenant')
export class TenantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password_hash: string;

  @Column()
  nid_number: string;

  @Column()
  nid_document_url: string;

  @Column({ default: false })
  has_vehicle: boolean;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.PENDING,
  })
  status: TenantStatus;

  // Nullable until approved
  @ManyToOne(() => PropertyEntity, { nullable: true })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  // FK pointing to Landlord.id, nullable
  @ManyToOne(() => LandlordEntity, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by: LandlordEntity;

  @CreateDateColumn()
  created_at: Date;
}