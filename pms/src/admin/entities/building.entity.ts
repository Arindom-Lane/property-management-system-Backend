import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, ManyToOne} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { BlockEntity } from './block.entity';

@Entity('buildings')

export class BuildingEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(()=> BlockEntity, (block) => block.id)
    block_id: BlockEntity;

    @ManyToOne(() => AdminEntity, (admin) => admin.id)
    created_by: AdminEntity;

    @CreateDateColumn()
    created_at: Date;

}