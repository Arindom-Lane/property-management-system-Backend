import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
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

    @ManyToOne (() => AdminEntity, (admin) => admin.id)
    created_by: AdminEntity;
    
    @CreateDateColumn()
    created_at: Date;

    @OneToMany(()=> BuildingEntity, (building) => building.id)
    building: BuildingEntity;
    
}