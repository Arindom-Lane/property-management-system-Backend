import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { workOrder } from "./work-order.entity";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  rating: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => workOrder, (order) => order.review)
  @JoinColumn({ name: "work_order_id" })
  workOrder: workOrder;

  @Column({ type: "int" })
  landlordId: number;
}