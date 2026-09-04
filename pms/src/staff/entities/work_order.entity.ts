import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ReviewEntity } from './review.entity';
import { IssueEntity } from 'src/tenant/entities/issue.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import { StaffEntity } from './staff.entity';
import { WorkerEntity } from './worker.entity';
import { TransactionEntity } from 'src/landlord/entities/transaction.entity';
export enum OrderStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  TENANT_CONFIRMED = 'tenant_confirmed',
  COMPLETE = 'complete',
}

@Entity('work_order')
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IssueEntity)
  @JoinColumn({ name: 'issue_id' })
  issue: IssueEntity;

  @ManyToOne(() => PropertyEntity)
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @ManyToOne(() => LandlordEntity)
  @JoinColumn({ name: 'landlord_id' })
  landlord: LandlordEntity;

  @ManyToOne(() => TenantEntity, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: TenantEntity | null;

  @ManyToOne(() => StaffEntity)
  @JoinColumn({ name: 'staff_id' })
  staff: StaffEntity;

  @ManyToOne(() => WorkerEntity, { nullable: true })
  @JoinColumn({ name: 'worker_id' })
  worker?: WorkerEntity | null;

  @OneToOne(() => ReviewEntity, (review) => review.workOrder, { nullable: true })
  review?: ReviewEntity | null;
  
//add transaction work order relation inversely

  @OneToOne(
  () => TransactionEntity,
  (transaction) => transaction.work_order_id,
  { nullable: true },
)
transaction?: TransactionEntity | null;

  @Column()
  created_by_type: string;

  @Column()
  created_by_id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  labor_cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  materials_cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additional_cost: number;
}