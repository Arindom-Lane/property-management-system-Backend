import { AdminEntity } from 'src/admin/entities/admin.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { TransactionEntity } from './transaction.entity';

export enum UserStatus {
    active = 'active',
    inactive = 'inactive',
}


@Entity('landlords')

export class LandlordEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

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

    @ManyToOne(() => AdminEntity, (admin) => admin.id)
    admin: AdminEntity;

    @OneToMany(() => PropertyEntity, (property) => property.landlord_id)
    properties: PropertyEntity[];

    @OneToMany(() => TransactionEntity, (transaction) => transaction.landlord_id)
    transactions: TransactionEntity[];


}