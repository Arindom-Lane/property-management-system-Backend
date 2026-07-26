import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';


@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
}
