import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Worker } from "./worker.entity";
import { IsOptional } from "class-validator";
import {Review} from "./review.entity"

export enum orderStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending",
  done = "complete",
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

  @IsOptional()
  @ManyToOne(() => Worker, (worker) => worker.workOrders, {
    nullable: true,
  })
  @JoinColumn()
  worker?: Worker;

  @OneToOne(() => Review, (review) => review.workOrder)
  review: Review;
}
