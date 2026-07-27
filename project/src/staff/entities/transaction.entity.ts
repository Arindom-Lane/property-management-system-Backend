import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { workOrder } from './work-order.entity';
import { LandlordEntity } from '../../landlord/entities/landloard.entity';

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

  // Connected to the Work Order that generated this bill
  @ManyToOne(() => workOrder, (order) => order.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: workOrder;

  // Connected to the Landlord who must pay
  @ManyToOne(() => LandlordEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'landlord_id' })
  landlord: LandlordEntity;
}