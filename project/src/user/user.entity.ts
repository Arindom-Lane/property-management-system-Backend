import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

export enum userRole{
    admin = 'admin',
    landloard = 'landloard',
    tenant = 'tenant',
    staff = 'staff',
}

@Entity('User')
export class User{
    @PrimaryGeneratedColumn()
    id: string;

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar'})
    email: string;

    @Column()
    passowrd: string;

    @Column({type: 'enum', enum userRole, default: userRole.tenant})
    role: string;

    //(Format: YYYY-MM-DD HH:MM:SS.microseconds)
    //example: 2026-02-16 17:00:00.123456
    @CreateDateColumn() 
    created_at: Date;


    
}