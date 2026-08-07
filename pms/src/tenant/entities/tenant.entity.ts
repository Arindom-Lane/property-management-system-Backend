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
import { IssueEntity } from './issue.entity';
import { PaymentEntity } from './payment.entity';

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

  // Assigned Property
  @ManyToOne(() => PropertyEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  // Approved By Landlord
  @ManyToOne(() => LandlordEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'approved_by' })
  approved_by: LandlordEntity;

  // Tenant Issues
  @OneToMany(() => IssueEntity, (issue) => issue.tenant, {
    cascade: true,
  })
  issues: IssueEntity[];
   
  @OneToMany(
  () => PaymentEntity,
  (payment) => payment.tenant,
)
payments: PaymentEntity[];

  @CreateDateColumn()
  created_at: Date;
}