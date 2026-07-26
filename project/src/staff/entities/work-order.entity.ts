import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum status {
  active = "active",
  inactive = "inactive",
}

@Entity()
export class workOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: status, default: status.inactive })
  status: status;

  @Column()
  labor_cost: number;

  @Column()
  materials_cost: number;

  @ManyToOne(() => Worker, (worker) => worker.workOrders)
  @JoinColumn({ name: "worker_id" }) // 3. This puts the foreign key column exactly where it belongs
  worker: Worker;
}
