import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';

export enum ListingStatus {
    not_listed = 'not_listed',
    for_rent = 'for_rent',
    for_sale = 'for_sale',
}


@Entity('property')

export class PropertyEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    unit_number: string;

    @Column()
    building_id: number;

    @Column()
    landlord_id: number;

    @Column(type: 'decimal', precision: 10, scale: 2)
    rent_amount: number;

    @Column()
    Phone: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: ListingStatus,
        default: ListingStatus.not_listed,
    })
    listing_status: ListingStatus;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.vacant,
    })
    status: Status;

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => LandlordEntity, (landlord) => landlord.id)
    landlord: LandlordEntity;
}