import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import {workOrder} from "./work-order.entity"

export enum status {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class Worker{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar"})
    name: string;

    @Column({type: "int"})
    phone: number;

    @Column({type: 'enum', enum: status, default: status.inactive,})
    status: status;

    @OneToMany(() => WorkOrder, (workOrder) => workOrder.worker)
    workOrders: workOrder[];

}   