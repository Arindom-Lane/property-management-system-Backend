import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkOrder } from './work_order.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => WorkOrder, (workOrder) => workOrder.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @Column()
  rating: string;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.reviews, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: TenantEntity | null;
}
