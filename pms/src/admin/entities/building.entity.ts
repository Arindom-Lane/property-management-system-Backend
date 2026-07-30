import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn} from 'typeorm';

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

    
}