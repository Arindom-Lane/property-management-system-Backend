import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LandlordEntity } from './landlord.entity';
import { PropertyEntity } from './property.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import { WorkOrder } from 'src/staff/entities/work_order.entity';

export enum Transaction_type {
    rent = 'rent',
    electricity = 'electricity',
    water = 'water',
    gas = 'gas',
    service_charge = 'service_charge',
    parking = 'parking',
    work_order_cost = 'work_order_cost',
}

export enum payer_type {
    landlord = 'landlord',
    tenant = 'tenant',
}

export enum status {
    pending = 'pending',
    paid = 'paid',
    rejected = 'rejected',
}

export enum created_by_type {
    landlord = 'landlord',
    tenant = 'tenant',
    staff = 'staff',
}

@Entity('transactions')

export class TransactionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: Transaction_type,
        default: Transaction_type.rent,
    })
    type: Transaction_type;

    @Column({type: 'decimal'})
    amount: number;

    @ManyToOne(() => PropertyEntity, (property) => property.transactions)
    property_id: PropertyEntity;

    @ManyToOne(() => LandlordEntity, (landlord) => landlord.transactions)
    landlord?: LandlordEntity;

    @ManyToOne(() => TenantEntity, (tanent) => tanent.id)
    tenant_id?: TenantEntity;
//chane relation one to one with work order and add join column
   @OneToOne( () => WorkOrder, (workOrder) => workOrder.transaction,
  { nullable: true },
   )
    @JoinColumn({ name: 'work_order_id' })
    work_order_id?: WorkOrder | null;

    @Column({
        type: "enum",
        enum: payer_type,
        default: payer_type.landlord,
    })
    payer_type: payer_type;


    @Column({
        type: "enum",
        enum: status,
        default: status.pending,
    })
    status: status;

    @Column({
        type: "enum",
        enum: created_by_type,
        default: created_by_type.landlord,
    })
    created_by_type?: created_by_type;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    paid_at?: Date;

}