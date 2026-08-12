import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TenantEntity } from './tenant.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

@Entity('issue')
export class IssueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.issues, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @ManyToOne(() => PropertyEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    nullable: true,
  })
  image_url: string;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status: IssueStatus;

  @CreateDateColumn()
  created_at: Date;
}