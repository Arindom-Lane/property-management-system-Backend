import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, OneToOne } from 'typeorm';
import { ReviewEntity } from './review.entity';



export enum OrderStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    TENANT_CONFIRMED = "tanent_confirmed",
    COMPLETE = "complete"
}


@Entity('Work_Order')
export class WorkOrder {
    @PrimaryGeneratedColumn()
    id: number;

    //issue_Id
    //property_Id
    //landlord_id
    //taennt_id
    //staff_id
    //worker id

    @OneToOne(() => ReviewEntity, ReviewEntity => ReviewEntity.WorkOrder, {
        cascade: true
    })
    @JoinColumn()
    ReviewEntity: ReviewEntity;

    @Column()
    created_by_type: string;

    @Column()
    created_by_id: number;

    @Column({ type: "decimal" })
    material_cost: number;

    @Column({ type: "decimal" })
    labor_cost: number;



    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    completed_at?: Date;


}



