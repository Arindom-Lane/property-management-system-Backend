import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { LandlordEntity } from './landlord.entity';
import { workOrder } from 'src/staff/entities/work-order.entity';

@Entity('properties')
export class PropertyEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    building_id?: number;

    @Column()
    owner_id?: number;

    @Column()
    current_tenant_id?: number;

    @Column()
    floor_number?: number;

    @Column()
    house_number?: string;

    @Column()
    house_type?: string;

    @Column()
    price?: number;

    @Column()
    status?: 'pending' | 'active' | 'rejected';

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;


    @ManyToOne(() => LandlordEntity, landlord => landlord.property, { onDelete: 'CASCADE' })
    landlord?: LandlordEntity;

    @OneToMany(() => workOrder, (workOrder) => workOrder.property, { cascade: true })
    workOrders?: workOrder[];



}
