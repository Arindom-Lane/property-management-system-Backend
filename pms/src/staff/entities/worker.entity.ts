import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne, JoinColumn,OneToMany, Index } from 'typeorm';
import { StaffEntity } from './staff.entity';


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
    @JoinColumn({ name: 'created_by' })
    created_by: StaffEntity;


    @CreateDateColumn()
    created_at: Date;


}



