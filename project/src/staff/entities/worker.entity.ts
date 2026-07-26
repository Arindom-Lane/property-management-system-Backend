import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { WorkerCategory } from './worker-category.entity';
import { WorkOrder } from './work-order.entity';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: 'available' })
  status: string;

  @OneToMany(() => WorkerCategory, (wc) => wc.worker)
  categories: WorkerCategory[];

  @OneToMany(() => WorkOrder, (wo) => wo.worker)
  workOrders: WorkOrder[];
} 