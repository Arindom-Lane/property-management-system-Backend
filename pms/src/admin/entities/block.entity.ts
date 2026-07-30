import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { BuildingEntity } from './building.entity';

@Entity('blocks')
export class BlockEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @ManyToOne(() => AdminEntity)
    @JoinColumn({ name: 'created_by_id' }) // Added JoinColumn
    created_by: AdminEntity;
    
    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => BuildingEntity, (building) => building.block_id)
    building: BuildingEntity[]; // Changed to array since it's OneToMany
}