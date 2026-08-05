import { AdminEntity } from 'src/admin/entities/admin.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { TransactionEntity } from './transaction.entity';

export enum LandlordStatus {
    active = 'active',
    inactive = 'inactive',
}


@Entity('landlords')

export class LandlordEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    password_hash: string;

    @Column({
        type: "enum",
        enum: LandlordStatus,
        default: LandlordStatus.active,
    })
    status: LandlordStatus;

    @ManyToOne(() => AdminEntity, (admin) => admin.id)
    created_by: AdminEntity;

    @OneToMany(() => PropertyEntity, (property) => property.id)
    properties: PropertyEntity[];

    @OneToMany(() => TransactionEntity, (transaction) => transaction.id)
    transactions: TransactionEntity[];

    @CreateDateColumn()
    created_at: Date;
}