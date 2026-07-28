import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn, OneToMany } from 'typeorm';
import { PropertyEntity } from './property.entity';
import {workOrder} from "../../staff/entities/work-order.entity"
@Entity('landlords')
export class LandlordEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  address: string;

  @Column({ default: 'active' })
  status: 'active' | 'suspended';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;



  @OneToMany(() => PropertyEntity, property => property.landlord, { cascade: true })
  property?: PropertyEntity[];

  @OneToMany(() => workOrder, workOrder => workOrder.landlord, { cascade: true })
  workOrders?: workOrder[];


}




