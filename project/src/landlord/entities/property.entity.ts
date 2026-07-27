import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn, ManyToOne } from 'typeorm';
import { LandlordEntity } from './landlord.entity';

@Entity('properties')
export class PropertyEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    building_id?:number;
        
    @Column()
    owner_id?: number;

    @Column()
    current_tenant_id?: number;
    
    @Column()
    floor_number?: number;

    @Column()
    house_number?: string;  

    @Column()
    house_type?: string;
    
    @Column()
    price?: number;
    
    @Column()
    status?: 'pending' | 'active' | 'rejected';

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;


    @ManyToOne(() => LandlordEntity, landlord => landlord.property, { onDelete: 'CASCADE' })
    landlord?: LandlordEntity;


}
