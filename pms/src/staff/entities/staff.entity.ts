import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { IsOptional } from 'class-validator';
export enum StaffStatus {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}

@Entity('staff')
export class StaffEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status: StaffStatus;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  @IsOptional()
  created_by?: AdminEntity;

  @CreateDateColumn()
  created_at: Date;
}
