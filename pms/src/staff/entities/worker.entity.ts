import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm'; // <-- 1. Add OneToMany import
import { StaffEntity } from './staff.entity';
import { WorkOrder } from './work_order.entity'; // <-- 2. Import WorkOrder entity (adjust path if needed)
import { IsOptional } from 'class-validator';

export enum WorkerStatus {
    FREE = "free",
    BUSY = "busy",
}

@Entity('worker')
export class WorkerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    worker_area: string;

    @Column({
        type: "enum",
        enum: WorkerStatus,
        default: WorkerStatus.FREE,
    })
    status: WorkerStatus;

    @ManyToOne(() => StaffEntity)
    @JoinColumn({ name: 'created_by_id' })
    @IsOptional()
    created_by: StaffEntity;

    @CreateDateColumn()
    created_at: Date;

    // <-- 3. Add the OneToMany relation here -->
    @OneToMany(() => WorkOrder, (workOrder) => workOrder.worker)
    workOrders: WorkOrder[];
}
