import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { BlockEntity } from './block.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';

@Entity('buildings')
export class BuildingEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(() => BlockEntity)
    @JoinColumn({ name: 'block_id' }) // Added JoinColumn
    block_id: BlockEntity;

    @ManyToOne(() => AdminEntity)
    @JoinColumn({ name: 'created_by_id' }) // Added JoinColumn
    created_by: AdminEntity;

    @OneToMany(() => PropertyEntity, (property) => property.building_id)
    properties: PropertyEntity[];

    @CreateDateColumn()
    created_at: Date;
}