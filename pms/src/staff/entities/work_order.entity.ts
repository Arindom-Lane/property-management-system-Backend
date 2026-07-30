import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { IssueEntity } from 'src/tenant/entities/issue.entity'; // Adjust path as needed
import { PropertyEntity } from 'src/landlord/entities/property.entity'; // Adjust path as needed
import { LandlordEntity } from 'src/landlord/entities/landlord.entity'; // Adjust path as needed
import { TenantEntity } from 'src/tenant/entities/tenant.entity'; // Adjust path as needed
import { StaffEntity } from './staff.entity'; // Adjust path as needed
import { WorkerEntity } from './worker.entity'; // Adjust path as needed

export enum OrderStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    TENANT_CONFIRMED = "tenant_confirmed", // Fixed slight typo: tanent -> tenant
    COMPLETE = "complete"
}

@Entity('Work_Order')
export class WorkOrder {
    @PrimaryGeneratedColumn()
    id: number;

    // --- Added relationships based on your comments ---
    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issue_id' })
    issue: IssueEntity;

    @ManyToOne(() => PropertyEntity)
    @JoinColumn({ name: 'property_id' })
    property: PropertyEntity;

    @ManyToOne(() => LandlordEntity)
    @JoinColumn({ name: 'landlord_id' })
    landlord: LandlordEntity;

    @ManyToOne(() => TenantEntity)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantEntity;

    @ManyToOne(() => StaffEntity)
    @JoinColumn({ name: 'staff_id' })
    staff: StaffEntity;

    @ManyToOne(() => WorkerEntity)
    @JoinColumn({ name: 'worker_id' })
    worker: WorkerEntity;

    // --- Properly mapped Review Relationship ---
    @OneToOne(() => ReviewEntity, review => review.workOrder, {
        cascade: true
    })
    @JoinColumn({ name: 'review_id' }) // JoinColumn belongs on the owning side
    review: ReviewEntity;

    @Column()
    created_by_type: string;

    @Column()
    created_by_id: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn() // Usually completed_at is a standard @Column(type: 'timestamp', nullable: true), not a CreateDateColumn. 
    completed_at?: Date;
}