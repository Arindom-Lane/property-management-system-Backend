import { Column, Entity, PrimaryGeneratedColumn,OneToOne,JoinColumn } from "typeorm";
import { Worker } from "./worker.entity";
export enum orderStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending",
  done = "complete"
}


@Entity()
export class workOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: orderStatus, default: orderStatus.inactive })
  workStatus: orderStatus;

  @Column()
  labor_cost: number;

  @Column()
  materials_cost: number;

  @OneToOne(() => Worker, (worker) => worker.workOrders, {cascade: true})
  @JoinColumn()
  worker?: Worker;
}
