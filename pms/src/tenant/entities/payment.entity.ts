import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TenantEntity } from './tenant.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Entity('payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TenantEntity, { eager: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @ManyToOne(() => PropertyEntity, { eager: true })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column()
  payment_month: string;

  @Column()
  payment_year: number;

  @Column()
  payment_method: string;

  @Column({
    unique: true,
  })
  transaction_id: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  paid_at: Date;
}