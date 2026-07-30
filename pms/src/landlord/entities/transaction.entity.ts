import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LandlordEntity } from './landlord.entity';

export enum type {
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

export class TransactionEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
            type: "enum",
            enum: type,
            default: type.rent,
        })
    type: type;

    @Column(type:'decimal')
    amount: number;
    
    @Column()
    property_id: number;

    @Column()
    landlord_id: number;

    @Column()
    tenant_id: number;

    @Column()
    work_order_id?: number;

    @Column({
        type: "enum",
        enum: payer_type,
        default: payer_type.landlord,
    })
    payer_type: payer_type;


    @Column()
    payer_id: number;

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
    created_by_type: created_by_type;

    @Column()
    created_by_id: number;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    paid_at?: Date;


    @ManyToOne(() => LandlordEntity, (landlord) => landlord.id)
    landlord: LandlordEntity;








}