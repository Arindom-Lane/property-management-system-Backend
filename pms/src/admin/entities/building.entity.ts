import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, ManyToOne} from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('buildings')

export class BuildingEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    block_id: number;

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => AdminEntity, (admin) => admin.id)
    admin: AdminEntity;
    
}