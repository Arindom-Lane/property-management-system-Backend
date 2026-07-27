import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('landlords')
export class LandlordEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string;

  @Column()
  phone_number?: string;

  @Column()
  address?: string;

  @Column({ default: 'landlord' })
  role?: string;

  @Column({ default: 'active' })
  status?: 'active' | 'suspended';

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
  
}