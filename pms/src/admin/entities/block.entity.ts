import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn} from 'typeorm';

@Entity('blocks')

export class BlockEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    created_by: string;
    
    @CreateDateColumn()
    created_at: Date;
}