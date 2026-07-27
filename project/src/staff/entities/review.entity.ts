import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { workOrder } from './work-order.entity';
import { LandlordEntity } from '../../landlord/entities/landloard.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number; // 1 to 5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => workOrder, (order) => order.review,  { cascade: true })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: workOrder;

  @ManyToOne(() => LandlordEntity, { cascade: true })
  @JoinColumn({ name: 'landlord_id' })
  landlord: LandlordEntity;
}