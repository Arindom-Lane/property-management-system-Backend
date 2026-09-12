import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';

export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum ComplaintAgainstType {
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
  STAFF = 'STAFF',
}

@Entity('complaints')
export class ComplaintEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    // who filed the complaint (LANDLORD, TENANT, STAFF)
    @Column()
    filed_by_type: string;

    @Column()
    filed_by_id: number;

    // who/what the complaint is against
    @Column({
        type: 'enum',
        enum: ComplaintAgainstType,
    })
    against_type: ComplaintAgainstType;

    @Column({ nullable: true })
    against_id: number;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: ComplaintStatus,
        default: ComplaintStatus.PENDING,
    })
    status: ComplaintStatus;

    // admin inspection notes
    @Column({ type: 'text', nullable: true })
    admin_note: string;

    // admin who inspected/resolved the complaint
    @ManyToOne(() => AdminEntity, { nullable: true })
    @JoinColumn({ name: 'reviewed_by_id' })
    reviewed_by: AdminEntity;

    @CreateDateColumn()
    created_at: Date;
}
