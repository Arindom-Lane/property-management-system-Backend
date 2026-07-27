import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,OneToMany,
} from "typeorm";
import { Worker } from "./worker.entity";
import { IsOptional } from "class-validator";
import {Review} from "./review.entity"
import { LandlordEntity } from "../../landlord/entities/landlord.entity";

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

  ///property of admin

  //isuue column

  @ManyToOne(() => LandlordEntity, { nullable: true })
  @JoinColumn({ name: 'landlord_id' })
  landlord?: LandlordEntity;

  @OneToOne(() => Review, (review) => review.workOrder)
  review?: Review;


  
}