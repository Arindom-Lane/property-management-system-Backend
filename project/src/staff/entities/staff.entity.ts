import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn, OneToMany } from 'typeorm';
import {workOrder} from "../entities/work-order.entity"
@Entity('staff')
export class StaffEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  address?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


}




