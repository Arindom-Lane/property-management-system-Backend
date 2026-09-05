import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { BuildingEntity } from './building.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';

@Entity('blocks')
export class BlockEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @ManyToOne(() => AdminEntity)
    @JoinColumn({ name: 'created_by_id' }) 
    created_by: AdminEntity;
    
    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => BuildingEntity, (building) => building.block_id)
    building: BuildingEntity[]; 

    @OneToMany(() => PropertyEntity, (property) => property.block)
    properties: PropertyEntity[];
}