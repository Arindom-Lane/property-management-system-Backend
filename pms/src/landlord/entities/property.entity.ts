import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatus {
    active = 'active',
    inactive = 'inactive',
}


@Entity('landlords')

export class LandlordEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    unit_number: string;

    @Column()
    building_id: number;

    @Column()
    landlord_id: number;

    @Column(type: 'decimal', precision: 10, scale: 2)
    rent_amount: number;

    @Column()
    Phone: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.active,
    })

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;
}