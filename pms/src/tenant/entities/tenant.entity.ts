import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { PropertyEntity } from '../../landlord/entities/property.entity';
import { LandlordEntity } from '../../landlord/entities/landlord.entity';
import { ReviewEntity } from '../../staff/entities/review.entity';
import { IssueEntity } from './issue.entity';
// import { PaymentEntity } from './payment.entity';

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

  @Column({ unique: true })
  phone: string;

  @Column()
  password_hash: string;

  @Column({ unique: true })
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

  @OneToOne(() => PropertyEntity, { nullable: true })
  // Assigned Property
  @ManyToOne(() => PropertyEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'property_id' })
  property?: PropertyEntity | null;

  @ManyToOne(() => LandlordEntity, { nullable: true })
  // Approved By Landlord
  @ManyToOne(() => LandlordEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'approved_by' })
  approved_by?: LandlordEntity | null;

  // Tenant Issues
  @OneToMany(() => IssueEntity, (issue) => issue.tenant, {
    cascade: true,
  })
  issues: IssueEntity[];
   

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ReviewEntity, (review) => review.tenant)
  reviews: ReviewEntity[];
}