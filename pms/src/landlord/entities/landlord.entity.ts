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
}