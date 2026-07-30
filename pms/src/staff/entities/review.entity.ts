import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { WorkOrder } from './work_order.entity';

@Entity('Review')
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // Inverse side of the OneToOne relationship. 
    // No @JoinColumn here, it lives on the WorkOrder.
    @OneToOne(() => WorkOrder, workOrder => workOrder.review)
    workOrder: WorkOrder;

    @Column()
    rating: string;

    @Column()
    comment: string;

    @CreateDateColumn()
    created_at: Date;
}