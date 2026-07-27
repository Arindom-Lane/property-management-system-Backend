import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LandlordEntity } from "./landlord.entity";

@Entity('work_orders')
export class WorkOrderEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    issue_id?: number;

    @Column()
    requester_id?: number;
    
    @Column()
    assigned_staff_id?: number;

    @Column()
    worker_id?: number;

    @Column()
    category_id?: number;
    
    @Column()
    status?: 'requested' | 'dispatched' | 'tenant_confirmed' | 'completed';

    @CreateDateColumn()
    tenant_confirmed_at?: Date;

    @CreateDateColumn()
    completed_at?: Date;

    @Column()
    labor_cost?: number;

    @Column()
    material_cost?: number;

    @CreateDateColumn()
    created_at?: Date;

    @ManyToOne(() => LandlordEntity, landlord => landlord.workOrders, { onDelete: 'CASCADE' })
    landlord?: LandlordEntity;



}