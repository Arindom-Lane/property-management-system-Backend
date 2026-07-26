import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Worker } from './worker.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  issueId: string;

  @Column()
  categoryId: string;

  @Column()
  requestedById: string;

  @Column({ nullable: true })
  workerId: string;

  @ManyToOne(() => Worker, (worker) => worker.workOrders, { nullable: true })
  worker: Worker;

  @Column({ default: 'requested' })
  status: string;

  @Column({ type: 'decimal', nullable: true })
  laborCost: number;

  @Column({ type: 'decimal', nullable: true })
  materialsCost: number;

  @CreateDateColumn()
  createdAt: Date;
}