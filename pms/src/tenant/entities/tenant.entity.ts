import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { ReviewEntity } from 'src/staff/entities/review.entity';

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

  @ManyToOne(() => PropertyEntity, { nullable: true })
  @JoinColumn({ name: 'property_id' })
  property?: PropertyEntity | null;

  @ManyToOne(() => LandlordEntity, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by?: LandlordEntity | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ReviewEntity, (review) => review.tenant)
  reviews: ReviewEntity[];
}