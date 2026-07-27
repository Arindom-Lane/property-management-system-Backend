import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { workOrder } from './work-order.entity';
import { LandlordEntity } from '../../landlord/entities/landlord.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'service_fee' })
  type: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => workOrder, (order) => order.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: workOrder;

  @ManyToOne(() => LandlordEntity)
  @JoinColumn({ name: 'landlord_id' })
  landlord: LandlordEntity;
}