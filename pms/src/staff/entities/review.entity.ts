import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, OneToOne } from 'typeorm';
import { WorkOrder } from './work_order.entity'



@Entity('Review')
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => WorkOrder, WorkOrder => WorkOrder.ReviewEntity)
    WorkOrder: WorkOrder;

    //tanent

    @Column()
    rating: string;

    @Column()
    comment: string;

    @CreateDateColumn()
    created_at: Date;


}



