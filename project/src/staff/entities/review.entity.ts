import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { workOrder } from "./work-order.entity";

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 400 })
  workReview: string;

  @OneToOne(() => workOrder, (workOrder) => workOrder.review)
  @JoinColumn({ name: "work_order_id" }) // This enforces the UNIQUE constraint
  workOrder: workOrder;
}
