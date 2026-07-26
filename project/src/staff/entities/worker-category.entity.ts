import {
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Worker } from './worker.entity';

@Entity('worker_categories')
export class WorkerCategory {
  @PrimaryColumn()
  workerId: string;

  @PrimaryColumn()
  categoryId: string;

  @ManyToOne(() => Worker, (worker) => worker.categories, { onDelete: 'CASCADE' })
  worker: Worker;

  @ManyToOne(() => Worker, () => undefined, { onDelete: 'CASCADE' })
  category: any;
}