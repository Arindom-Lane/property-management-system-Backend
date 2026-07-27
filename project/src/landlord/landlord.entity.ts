import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

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

  
/**
 * 
 
 * 
 */
  /**
   * RELATIONSHIP 1: Landlord owns many Properties (1:N)
   * properties.owner_id → landlords.id
   
  @OneToMany(() => Properties, (property) => property.landlord)
  owned_properties?: Properties[];

  /**
   * RELATIONSHIP 2: Landlord requests many WorkOrders (1:N)
   * work_orders.requested_by_id → landlords.id
   
  @OneToMany(() => WorkOrders, (workOrder) => workOrder.landlord)
  requested_work_orders?: WorkOrders[];

  /**
   * RELATIONSHIP 3: Landlord has many Transactions (1:N)
   * transactions.payer_id → landlords.id (when type = 'service_fee')
   
  @OneToMany(() => Transactions, (transaction) => transaction.landlord)
  transactions?: Transactions[];

  /**
   * RELATIONSHIP 4: Landlord manages many Leases (1:N)
   * leases.landlord_id → landlords.id
   
  @OneToMany(() => Leases, (lease) => lease.landlord)
  leases?: Leases[];
*/
  
}



@Entity('blocks')
export class Blocks {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  city?: string;

  @Column()
  created_by_id?: number;

  @CreateDateColumn()
  created_at?: Date;
/** */ 
  // ===== RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Block has many Buildings (1:N)
   * buildings.block_id → blocks.id
   
  @OneToMany(() => Buildings, (building) => building.block)
  buildings?: Buildings[];
  */
}



@Entity('buildings')
export class Buildings {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  block_id?: number;

  @Column()
  name?: string;

  @Column()
  total_floors?: number;

  @CreateDateColumn()
  created_at?: Date;

  // ===== RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Building belongs to Block (N:1)
   * blocks.id → buildings.block_id
   
  @ManyToOne(() => Blocks, (block) => block.buildings)
  @ForeignKey(() => Blocks)
  block?: Blocks;

  /**
   * RELATIONSHIP 2: Building has many Properties (1:N)
   * properties.building_id → buildings.id
   
  @OneToMany(() => Properties, (property) => property.building)
  properties?: Properties[];
  */
}


@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @CreateDateColumn()
  created_at?: Date;
}



@Entity('properties')
@Unique(['tenant_id'])
export class Properties {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  building_id?: number;

  @Column()
  landlord_id?: number;

  @Column({ nullable: true, unique: true })
  tenant_id?: number;

  @Column()
  floor_number?: number;

  @Column()
  house_number?: string;

  @Column()
  type?: 'rent' | 'sale';

  @Column()
  price?: number;

  @Column({ default: 'pending' })
  status?: 'pending' | 'active' | 'rejected';

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  amenities?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // ===== LANDLORD RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Property belongs to Building (N:1)
   * buildings.id → properties.building_id
   
  @ManyToOne(() => Buildings, (building) => building.properties)
  @ForeignKey(() => Buildings)
  building?: Buildings;

  /**
   * RELATIONSHIP 2: Property belongs to Landlord (N:1)
   * ⭐ KEY: Every property must have a landlord
   * landlords.id → properties.landlord_id
   
  @ManyToOne(() => Landlord, (landlord) => landlord.owned_properties)
  @ForeignKey(() => Landlord)
  landlord?: Landlord;

  /**
   * RELATIONSHIP 3: Property has ONE current Tenant (N:1 but acts as 1:1)
   * ⭐ UNIQUE constraint ensures only one tenant per property
   * tenants.id → properties.tenant_id
   
  @ManyToOne(() => Tenant)
  @ForeignKey(() => Tenant)
  current_tenant?: Tenant;

  /**
   * RELATIONSHIP 4: Property has many Leases (1:N)
   * Historical leases for this property
   * leases.property_id → properties.id
   
  @OneToMany(() => Leases, (lease) => lease.property)
  leases?: Leases[];

  /**
   * RELATIONSHIP 5: Property has many Issues (1:N)
   * Issues reported for this property
   * issues.property_id → properties.id
   
  @OneToMany(() => Issues, (issue) => issue.property)
  issues?: Issues[];
  */
}

@Entity('leases')
export class Leases {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  property_id?: number;

  @Column()
  tenant_id?: number;

  @Column()
  landlord_id?: number;

  @Column()
  type?: 'rent' | 'purchase';

  @Column({ default: 'pending' })
  status?: 'pending' | 'approved' | 'rejected' | 'closed';

  @Column({ nullable: true })
  start_date?: Date;

  @Column({ nullable: true })
  end_date?: Date;

  @Column({ nullable: true })
  terms?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // ===== LANDLORD RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Lease belongs to Property (N:1)
   * ⭐ KEY: Landlord approves leases for their properties
   * properties.id → leases.property_id
   
  @ManyToOne(() => Properties, (property) => property.leases)
  @ForeignKey(() => Properties)
  property?: Properties;

  /**
   * RELATIONSHIP 2: Lease is for Tenant (N:1)
   * tenants.id → leases.tenant_id
   
  @ManyToOne(() => Tenant)
  @ForeignKey(() => Tenant)
  tenant?: Tenant;

  /**
   * RELATIONSHIP 3: Lease belongs to Landlord (N:1)
   * landlords.id → leases.landlord_id
   
  @ManyToOne(() => Landlord, (landlord) => landlord.leases)
  @ForeignKey(() => Landlord)
  landlord?: Landlord;

  /**
   * RELATIONSHIP 4: Lease generates Transactions (1:N)
   * ⭐ KEY: Landlord receives rent payments
   * transactions.lease_id → leases.id
   
  @OneToMany(() => Transactions, (transaction) => transaction.lease)
  transactions?: Transactions[];
  */
}

@Entity('issues')
export class Issues {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  property_id?: number;

  @Column()
  reported_by_id?: number;

  @Column()
  category_id?: number;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @Column({ default: 'open' })
  status?: 'open' | 'in_progress' | 'resolved';

  @Column({ default: 'medium' })
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @Column({ nullable: true })
  attachments?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // ===== LANDLORD RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Issue belongs to Property (N:1)
   * ⭐ KEY: Landlord sees issues for their properties
   * properties.id → issues.property_id
   
  @ManyToOne(() => Properties, (property) => property.issues)
  @ForeignKey(() => Properties)
  property?: Properties;

  /**
   * RELATIONSHIP 2: Issue is reported by Tenant (N:1)
   * tenants.id → issues.reported_by_id
   
  @ManyToOne(() => Tenant)
  @ForeignKey(() => Tenant)
  reported_by?: Tenant;

  /**
   * RELATIONSHIP 3: Issue belongs to Category (N:1)
   * categories.id → issues.category_id
   
  @ManyToOne(() => Categories)
  @ForeignKey(() => Categories)
  category?: Categories;

  /**
   * RELATIONSHIP 4: Issue triggers WorkOrders (1:N)
   * ⭐ KEY: Landlord converts issues to work orders
   * work_orders.issue_id → issues.id
   
  @OneToMany(() => WorkOrders, (workOrder) => workOrder.issue)
  work_orders?: WorkOrders[];
  */
}



@Entity('workers')
export class Workers {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: 'available' })
  status?: 'available' | 'busy' | 'inactive';

  @Column({ nullable: true })
  rating?: number;

  @Column({ default: 0 })
  total_jobs?: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // ===== RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Worker has many Categories (N:M)
   * ⭐ Worker can do multiple job types (e.g., plumbing & electrical)
   * worker_categories join table
   
  @ManyToMany(() => Categories)
  @JoinTable({
    name: 'worker_categories',
    joinColumn: { name: 'worker_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories?: Categories[];

  */
}

@Entity('work_orders')
export class WorkOrders {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  issue_id?: number;

  @Column()
  landlord_id?: number;

  @Column()
  staff_id?: number;

  @Column({ nullable: true })
  worker_id?: number;

  @Column()
  category_id?: number;

  @Column({ default: 'requested' })
  status?: 'requested' | 'dispatched' | 'tenant_confirmed' | 'completed';

  @Column({ default: 'medium' })
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @Column({ nullable: true })
  estimated_cost?: number;

  @Column({ nullable: true })
  tenant_confirmed_at?: Date;

  @Column({ nullable: true })
  completed_at?: Date;

  @Column({ nullable: true })
  labor_cost?: number;

  @Column({ nullable: true })
  materials_cost?: number;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // ===== LANDLORD RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: WorkOrder belongs to Issue (N:1)
   * issues.id → work_orders.issue_id
   
  @ManyToOne(() => Issues, (issue) => issue.work_orders)
  @ForeignKey(() => Issues)
  issue?: Issues;

  /**
   * RELATIONSHIP 2: WorkOrder is requested by Landlord (N:1)
   * ⭐ KEY: Landlord creates work orders
   * landlords.id → work_orders.landlord_id
   
  @ManyToOne(() => Landlord, (landlord) => landlord.requested_work_orders)
  @ForeignKey(() => Landlord)
  landlord?: Landlord;

  /**
   * RELATIONSHIP 3: WorkOrder is assigned to Staff (N:1)
   * staff.id → work_orders.staff_id
   
  @ManyToOne(() => Staff)
  @ForeignKey(() => Staff)
  staff?: Staff;

  /**
   * RELATIONSHIP 4: WorkOrder is dispatched to Worker (N:1)
   * workers.id → work_orders.worker_id
   
  @ManyToOne(() => Workers)
  @ForeignKey(() => Workers)
  worker?: Workers;

  /**
   * RELATIONSHIP 5: WorkOrder belongs to Category (N:1)
   * categories.id → work_orders.category_id
   
  @ManyToOne(() => Categories)
  @ForeignKey(() => Categories)
  category?: Categories;

  /**
   * RELATIONSHIP 6: WorkOrder creates Transaction (1:1)
   * ⭐ KEY: Landlord gets billed through transaction
   * When work order completes, service fee transaction is auto-created
   * transactions.work_order_id → work_orders.id
   
  @OneToOne(() => Transactions, (transaction) => transaction.work_order)
  transaction?: Transactions;
  */
}


@Entity('worker_categories')
export class WorkerCategories {
  @PrimaryColumn()
  worker_id?: number;

  @PrimaryColumn()
  category_id?: number;
}

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  lease_id?: number;

  @Column({ nullable: true })
  work_order_id?: number;

  @Column()
  landlord_id?: number;

  @Column({ nullable: true })
  tenant_id?: number;

  @Column()
  type?: 'rent' | 'service_fee' | 'purchase';

  @Column()
  amount?: number;

  @Column({ default: 'pending' })
  status?: 'pending' | 'completed' | 'failed';

  @Column({ nullable: true })
  payment_method?: string;

  @Column({ nullable: true })
  transaction_date?: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // ===== LANDLORD RELATIONSHIPS =====

  /**
   * RELATIONSHIP 1: Transaction belongs to Lease (N:1)
   * ⭐ KEY: Landlord receives rent payments
   * type = 'rent' → references lease
   * leases.id → transactions.lease_id
   
  @ManyToOne(() => Leases, (lease) => lease.transactions)
  @ForeignKey(() => Leases)
  lease?: Leases;

  /**
   * RELATIONSHIP 2: Transaction belongs to WorkOrder (1:1)
   * ⭐ KEY: Service fee transaction created when work order completes
   * type = 'service_fee' → references work_order
   * work_orders.id → transactions.work_order_id (UNIQUE)
   
  @OneToOne(() => WorkOrders, (workOrder) => workOrder.transaction)
  @ForeignKey(() => WorkOrders)
  work_order?: WorkOrders;

  /**
   * RELATIONSHIP 3: Transaction belongs to Landlord (N:1)
   * ⭐ KEY: Landlord receives or pays through transactions
   * landlords.id → transactions.landlord_id
   
  @ManyToOne(() => Landlord, (landlord) => landlord.transactions)
  @ForeignKey(() => Landlord)
  landlord?: Landlord;

  /**
   * RELATIONSHIP 4: Transaction involves Tenant (N:1)
   * type = 'rent' → tenant pays
   * tenants.id → transactions.tenant_id
   
  @ManyToOne(() => Tenant)
  @ForeignKey(() => Tenant)
  tenant?: Tenant;
  */
}

@Entity('reviews')
@Unique(['work_order_id'])
export class Reviews {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  work_order_id?: number;

  @Column()
  tenant_id?: number;

  @Column()
  staff_id?: number;

  @Column()
  rating?: number;

  @Column()
  comment?: string;

  @CreateDateColumn()
  created_at?: Date;
}

