import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { workOrder } from "./work-order.entity";


export enum WorkerStatus {
  active = "active",
  busy = "busy",
  inactive = "inactive",
}

@Entity("workers")
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "int", unique: true })
  phone: string;

  @Column({ type: "enum", enum: WorkerStatus, default: WorkerStatus.active })
  status: WorkerStatus;

  @OneToMany(() => workOrder, (order) => order.worker)
  workOrders: workOrder[];

  
}
