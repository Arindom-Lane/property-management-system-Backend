import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, OneToMany} from 'typeorm';
import { BlockEntity } from './block.entity';
import { BuildingEntity } from './building.entity';

@Entity('admins')

export class AdminEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @OneToMany(() => AdminEntity, (admin) => admin.id)
    created_by?: AdminEntity[];

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => LandlordEntity, (landlord) => landlord.id)
    landlords: LandlordEntity[];

    @OneToMany(() => BlockEntity, (block) => block.id)
    blocks: BlockEntity[];

    @OneToMany(() => BuildingEntity, (building) => building.id)
    buildings: BuildingEntity[];
}