import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, ManyToOne} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { AdminEntity } from './admin.entity';

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

    @ManyToOne (() => AdminEntity, (admin) => admin.id)
    admin: AdminEntity;
}