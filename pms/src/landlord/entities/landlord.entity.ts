import { AdminEntity } from '../../admin/entities/admin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PropertyEntity } from './property.entity';
import { TransactionEntity } from './transaction.entity';
import { TenantEntity } from '../../tenant/entities/tenant.entity';
import { WorkOrder } from '../../staff/entities/work_order.entity';

export enum LandlordStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity('landlords')
export class LandlordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: LandlordStatus,
    default: LandlordStatus.active,
  })
  status: LandlordStatus;

  @ManyToOne(() => AdminEntity, (admin) => admin.landlords)
  created_by: AdminEntity;

  @OneToMany(() => PropertyEntity, (property) => property.landlord)
  properties: PropertyEntity[];

  @OneToMany(() => TenantEntity, (tenant) => tenant.approved_by)
  tenants: TenantEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.landlord)
  transactions: TransactionEntity[];

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.landlord)
  workOrders: WorkOrder[];

  @CreateDateColumn()
  created_at: Date;
}
