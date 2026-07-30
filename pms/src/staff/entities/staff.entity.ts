import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne, JoinColumn,OneToMany, Index } from 'typeorm';
export enum UserStatus {
    ACTIVE = "active",
    DEACTIVE = "deactive",
}


@Entity('staff')
export class StaffEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    password_hash: string;

    //   @Column()
    //   role?: string;

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;

    @ManyToOne(() => Admin)
    @JoinColumn({ name: 'created_by' })
    created_by: Admin;


    @CreateDateColumn()
    created_at: Date;


}



