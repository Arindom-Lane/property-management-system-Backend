import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, OneToOne } from 'typeorm';
import {WorkOrder} from './work_order.entity'



@Entity('Review')
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => WorkOrder, WorkOrder => WorkOrder.ReviewEntity)
    WorkOrder: WorkOrder;


    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    password_hash: string;


    @Column({
        type: "enum",
        enum: StaffStatus,
        default: StaffStatus.ACTIVE,
    })
    status: StaffStatus;

    @ManyToOne(() => Admin)
    @JoinColumn({ name: 'created_by' })
    created_by: Admin;


    @CreateDateColumn()
    created_at: Date;


}



