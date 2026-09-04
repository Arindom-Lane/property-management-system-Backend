import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import { PropertyEntity } from './property.entity';
import { LandlordEntity } from './landlord.entity';
import { Transaction_type, TransactionEntity } from './transaction.entity';

export enum BillStatus {
  unpaid = 'unpaid',
  paid = 'paid',
}

@Entity('tenant_bills')
export class TenantBillEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Transaction_type,
  })
  type: Transaction_type;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column()
  month: string;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @ManyToOne(() => PropertyEntity)
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @ManyToOne(() => LandlordEntity)
  @JoinColumn({ name: 'landlord_id' })
  landlord: LandlordEntity;

  @OneToOne(() => TransactionEntity, {
  nullable: true,
})
@JoinColumn({ name: 'transaction_id' })
transaction?: TransactionEntity | null;

  @Column({
    type: 'enum',
    enum: BillStatus,
    default: BillStatus.unpaid,
  })
  status: BillStatus;

  @CreateDateColumn()
  created_at: Date;
}