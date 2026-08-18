import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, Between, Like, IsNull, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { staffDto } from './dto/staff.dto';
import { WorkerEntity, WorkerStatus } from './entities/worker.entity';
import { WorkOrder, OrderStatus } from './entities/work_order.entity';
import { ReviewEntity } from './entities/review.entity';
import { StaffEntity } from './entities/staff.entity';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { CreateWorkOrderDto } from './dto/CreateWorkOrder.dto';
import { IssueEntity, IssueStatus } from 'src/tenant/entities/issue.entity';
import { PropertyEntity, Status as PropertyStatus, ListingStatus } from 'src/landlord/entities/property.entity';
import { LandlordEntity, LandlordStatus } from 'src/landlord/entities/landlord.entity';
import { TenantEntity, TenantStatus } from 'src/tenant/entities/tenant.entity';
import { DispatchWorkerDto } from './dto/DispatchWorkOrder.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { CompleteWorkOrderDto } from './dto/CompleteWorkOrder.dto';
import { UpdateWorkOrderDto } from './dto/UpdateWorkOrder.dto';
import { FilterWorkOrderDto } from './dto/FilterWorkOrder.dto';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';
import { FilterWorkerDto } from './dto/FilterWorker.dto';
//import { CreateTransactionDto } from './dto/CreateTransactionDto'; // Note: User said they created DTOs, assuming this filename
//import { FilterTransactionDto } from './dto/FilterTransactionDto';
import { IssueStatusDto } from './dto/IssueStatus.dto';
import { ConvertIssueDto } from './dto/ConvertIssue.dto';
import { TransactionEntity, Trnsaction_type, payer_type, status as TxnStatus, created_by_type } from 'src/landlord/entities/transaction.entity';
import { BlockEntity } from 'src/admin/entities/block.entity';
import { BuildingEntity } from 'src/admin/entities/building.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepo: Repository<WorkOrder>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(LandlordEntity)
    private readonly landlordRepo: Repository<LandlordEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(BlockEntity)
    private readonly blockRepo: Repository<BlockEntity>,
    @InjectRepository(BuildingEntity)
    private readonly buildingRepo: Repository<BuildingEntity>,
  ) { }

  // ==========================================
  // PRIVATE HELPERS (FINDERS)
  // ==========================================
  async findAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id }, relations: { landlords: true, staff: true, blocks: true, buildings: true } });
    if (!admin) throw new NotFoundException('Admin not found!');
    return admin;
  }

  async findWOrkOrder(id: number) {
    const workOrder = await this.workOrderRepo.findOne({
      where: { id },
      relations: {
        worker: true,
        review: { tenant: true },
        property: { landlord: true, tenant: true },
        landlord: true,
        tenant: { property: true, approved_by: true },
        staff: { created_by: true },
        issue: { tenant: true, property: { landlord: true } },
      },
    });
    if (!workOrder) throw new NotFoundException('WorkOrder not found!');
    return workOrder;
  }

  async findStaff(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id }, relations: { created_by: true } });
    if (!staff) throw new NotFoundException('Staff not found!');
    return staff;
  }

  async findIssue(id: number) {
    const issue = await this.issueRepo.findOne({
      where: { id },
      relations: { tenant: { property: true }, property: { landlord: true } },
    });
    if (!issue) throw new NotFoundException('Issue not found!');
    return issue;
  }

  async findProperty(id: number) {
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: { landlord: true, tenant: true, transactions: true, workOrders: { worker: true, review: true } },
    });
    if (!property) throw new NotFoundException('Property not found!');
    return property;
  }

  async findLandlord(id: number) {
    const landlord = await this.landlordRepo.findOne({ where: { id }, relations: { properties: true, tenants: true } });
    if (!landlord) throw new NotFoundException('Landlord not found!');
    return landlord;
  }

  async findTanent(id: number) {
    const tenant = await this.tenantRepo.findOne({
      where: { id },
      relations: { property: { landlord: true }, approved_by: true, issues: true, reviews: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found!');
    return tenant;
  }

  async findWorker(id: number) {
    const worker = await this.workerRepo.findOne({
      where: { id },
      relations: { created_by: true, workOrders: { property: { landlord: true }, review: true } },
    });
    if (!worker) throw new NotFoundException('Worker not found!');
    return worker;
  }

  async findBuilding(id: number) {
    const building = await this.buildingRepo.findOne({ where: { id }, relations: { block: true, properties: true, created_by: true } });
    if (!building) throw new NotFoundException('Building not found!');
    return building;
  }

  async findBlock(id: number) {
    const block = await this.blockRepo.findOne({ where: { id }, relations: { created_by: true, building: true } });
    if (!block) throw new NotFoundException('Block not found!');
    return block;
  }

  // ==========================================
  // STAFF AUTH & PROFILE
  // ==========================================
  async createStaff(data: staffDto): Promise<StaffEntity> {
    const existing = await this.staffRepo.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });
    if (existing) {
      throw new ForbiddenException('Staff with email or phone already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password_hash, saltRounds);
    const admin = await this.findAdmin(data.created_by);

    const staff = this.staffRepo.create({
      ...data,
      password_hash: hashedPassword,
      created_by: admin,
    });

    await this.staffRepo.save(staff);
    return staff;
  }

  async loginStaff(dto: staffDto) {
    const staff = await this.staffRepo.findOne({ where: { email: dto.email } });
    if (!staff) throw new NotFoundException('Email not found');
    const isPasswordCorrect = await bcrypt.compare(dto.password_hash, staff.password_hash);
    if (!isPasswordCorrect) throw new UnauthorizedException('Invalid password');
    return staff;
  }

  async findStaffByEmail(email: string) {
    return await this.staffRepo.findOne({ where: { email } });
  }

  async viewAllStaff() {
    return await this.staffRepo.find({ relations: { created_by: true } });
  }

  async deleteStaff(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Staff not found');
    await this.staffRepo.delete(id);
    return { message: `${staff.id} deleted` };
  }

  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================
  async getDashboardStats(staffId: number) {
    await this.findStaff(staffId);

    const [
      totalWorkOrders,
      pendingWorkOrders,
      assignedWorkOrders,
      inProgressWorkOrders,
      completedWorkOrders,
      totalWorkers,
      freeWorkers,
      busyWorkers,
      openIssues,
      inProgressIssues,
      totalProperties,
      occupiedProperties,
      vacantProperties,
      totalLandlords,
      totalTenants,
      totalBlocks,
      totalBuildings,
    ] = await Promise.all([
      this.workOrderRepo.count(),
      this.workOrderRepo.count({ where: { status: OrderStatus.PENDING } }),
      this.workOrderRepo.count({ where: { status: OrderStatus.ASSIGNED } }),
      this.workOrderRepo.count({ where: { status: OrderStatus.TENANT_CONFIRMED } }),
      this.workOrderRepo.count({ where: { status: OrderStatus.COMPLETE } }),
      this.workerRepo.count(),
      this.workerRepo.count({ where: { status: WorkerStatus.FREE } }),
      this.workerRepo.count({ where: { status: WorkerStatus.BUSY } }),
      this.issueRepo.count({ where: { status: IssueStatus.OPEN } }),
      this.issueRepo.count({ where: { status: IssueStatus.IN_PROGRESS } }),
      this.propertyRepo.count(),
      this.propertyRepo.count({ where: { status: PropertyStatus.OCCUPIED } }),
      this.propertyRepo.count({ where: { status: PropertyStatus.VACANT } }),
      this.landlordRepo.count({ where: { status: LandlordStatus.active } }),
      this.tenantRepo.count({ where: { status: TenantStatus.APPROVED } }),
      this.blockRepo.count(),
      this.buildingRepo.count(),
    ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await this.transactionRepo
      .createQueryBuilder('txn')
      .select('SUM(txn.amount)', 'total')
      .where('txn.type = :type', { type: Trnsaction_type.work_order_cost })
      .andWhere('txn.status = :status', { status: TxnStatus.paid })
      .andWhere('txn.paid_at >= :date', { date: startOfMonth })
      .getRawOne();

    const monthlyRent = await this.transactionRepo
      .createQueryBuilder('txn')
      .select('SUM(txn.amount)', 'total')
      .where('txn.type IN (:...types)', { types: [Trnsaction_type.rent, Trnsaction_type.service_charge, Trnsaction_type.parking] })
      .andWhere('txn.status = :status', { status: TxnStatus.paid })
      .andWhere('txn.paid_at >= :date', { date: startOfMonth })
      .getRawOne();

    return {
      workOrders: { total: totalWorkOrders, pending: pendingWorkOrders, assigned: assignedWorkOrders, inProgress: inProgressWorkOrders, completed: completedWorkOrders },
      workers: { total: totalWorkers, free: freeWorkers, busy: busyWorkers },
      issues: { open: openIssues, inProgress: inProgressIssues },
      properties: { total: totalProperties, occupied: occupiedProperties, vacant: vacantProperties },
      landlords: { total: totalLandlords },
      tenants: { total: totalTenants },
      hierarchy: { blocks: totalBlocks, buildings: totalBuildings },
      financials: { monthlyWorkOrderRevenue: parseFloat(monthlyRevenue?.total || '0'), monthlyRentCollected: parseFloat(monthlyRent?.total || '0') },
    };
  }

  async getWorkloadOverview(staffId: number) {
    await this.findStaff(staffId);

    // Worker Workload
    const workers = await this.workerRepo.find({ relations: { workOrders: true } });
    const workerLoad = workers.map(w => ({
      id: w.id, name: w.name, area: w.worker_area, status: w.status,
      activeOrders: w.workOrders.filter(wo => wo.status !== OrderStatus.COMPLETE).length,
      completedOrders: w.workOrders.filter(wo => wo.status === OrderStatus.COMPLETE).length,
    }));

    // Property Workload (Vacant/Occupied + Open Orders/Issues)
    const properties = await this.propertyRepo.find({ relations: { workOrders: true, issues: true, building: { block: true } } });
    const propertyLoad = properties
      .map(p => ({
        id: p.id, unit: p.unit_number, building: p.building?.name, block: p.building?.block?.name,
        status: p.status, listing: p.listing_status,
        openWorkOrders: p.workOrders.filter(wo => wo.status !== OrderStatus.COMPLETE).length,
        openIssues: p.issues.filter(i => i.status !== IssueStatus.RESOLVED).length,
        currentTenant: p.tenant?.name || 'Vacant',
      }))
      .filter(p => p.openWorkOrders > 0 || p.openIssues > 0 || p.status === PropertyStatus.VACANT);

    return { workerLoad, propertyLoad };
  }

  // ==========================================
  // WORKER MANAGEMENT
  // ==========================================
  async createWorker(staffId: number, data: CreateWorkerDto): Promise<WorkerEntity> {
    const staff = await this.findStaff(staffId);
    const exists = await this.workerRepo.findOne({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Worker email already exists');

    const newWorker = this.workerRepo.create({
      name: data.name, email: data.email, phone: data.phone,
      worker_area: data.worker_area, status: data.status ?? WorkerStatus.FREE, created_by: staff,
    });
    await this.workerRepo.save(newWorker);
    return newWorker;
  }

  async findAllWorkers(filterDto: FilterWorkerDto) {
    const { status, area, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = filterDto;
    const qb = this.workerRepo.createQueryBuilder('worker')
      .leftJoinAndSelect('worker.created_by', 'staff')
      .skip((page - 1) * limit).take(limit)
      .orderBy(`worker.${sortBy}`, sortOrder);

    if (status) qb.andWhere('worker.status = :status', { status });
    if (area) qb.andWhere('worker.worker_area = :area', { area });
    if (search) qb.andWhere('(worker.name ILIKE :search OR worker.email ILIKE :search OR worker.phone ILIKE :search)', { search: `%${search}%` });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateWorker(id: number, body: UpdateWorkerDto) {
    const worker = await this.findWorker(id);
    Object.assign(worker, body);
    await this.workerRepo.save(worker);
    return this.findWorker(id);
  }

  async toggleWorkerStatus(id: number) {
    const worker = await this.findWorker(id);
    worker.status = worker.status === WorkerStatus.FREE ? WorkerStatus.BUSY : WorkerStatus.FREE;
    await this.workerRepo.save(worker);
    return worker;
  }

  async deleteWorker(id: number) {
    const worker = await this.findWorker(id);
    const activeOrders = await this.workOrderRepo.count({ where: { worker: { id }, status: Not(OrderStatus.COMPLETE) } });
    if (activeOrders > 0) throw new BadRequestException(`Cannot delete worker. They have ${activeOrders} active work orders.`);
    await this.workerRepo.remove(worker);
    return { message: `${worker.name} has been deleted` };
  }

  async getWorkerSchedule(id: number) {
    const worker = await this.findWorker(id);
    const orders = await this.workOrderRepo.find({
      where: { worker: { id }, status: Not(OrderStatus.COMPLETE) },
      relations: { property: { building: { block: true }, landlord: true }, issue: true, tenant: true },
      order: { created_at: 'ASC' }
    });
    return { worker: { id: worker.id, name: worker.name, area: worker.worker_area, status: worker.status }, schedule: orders };
  }

  async getWorkerPerformance(id: number) {
    const worker = await this.findWorker(id);
    const completedOrders = await this.workOrderRepo.find({
      where: { worker: { id }, status: OrderStatus.COMPLETE },
      relations: { review: true }
    });

    const totalCompleted = completedOrders.length;
    const ratedOrders = completedOrders.filter(o => o.review);
    const avgRating = ratedOrders.length > 0
      ? ratedOrders.reduce((sum, o) => sum + parseInt(o.review.rating), 0) / ratedOrders.length
      : 0;

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.labor_cost + o.materials_cost + o.additional_cost, 0);

    return {
      worker: { id: worker.id, name: worker.name, area: worker.worker_area },
      stats: { totalCompleted, ratedCount: ratedOrders.length, averageRating: parseFloat(avgRating.toFixed(2)), totalRevenueGenerated: totalRevenue },
      recentOrders: completedOrders.slice(-5).map(o => ({ id: o.id, property: o.property?.unit_number, cost: o.labor_cost + o.materials_cost + o.additional_cost, rating: o.review?.rating })),
    };
  }

  async getWorkerPerformanceReport(query: any) {
    const workers = await this.workerRepo.find({ relations: { workOrders: { review: true, property: true } } });
    const report = workers.map(w => {
      const completed = w.workOrders.filter(o => o.status === OrderStatus.COMPLETE);
      const ratings = completed.map(o => o.review ? parseInt(o.review.rating) : null).filter(r => r !== null);
      return {
        id: w.id, name: w.name, area: w.area, status: w.status,
        completedCount: completed.length,
        avgRating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0,
        totalRevenue: completed.reduce((s, o) => s + o.labor_cost + o.materials_cost + o.additional_cost, 0),
      };
    });
    return { data: report, total: report.length };
  }

  // ==========================================
  // WORK ORDER MANAGEMENT
  // ==========================================
  async findAllWorkOrders(filterDto: FilterWorkOrderDto) {
    const { status, workerId, propertyId, landlordId, tenantId, issueId, buildingId, blockId, dateFrom, dateTo, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = filterDto;
    const qb = this.workOrderRepo.createQueryBuilder('wo')
      .leftJoinAndSelect('wo.worker', 'worker')
      .leftJoinAndSelect('wo.property', 'property')
      .leftJoinAndSelect('property.landlord', 'landlord')
      .leftJoinAndSelect('property.building', 'building')
      .leftJoinAndSelect('building.block', 'block')
      .leftJoinAndSelect('wo.tenant', 'tenant')
      .leftJoinAndSelect('wo.staff', 'staff')
      .leftJoinAndSelect('wo.issue', 'issue')
      .leftJoinAndSelect('wo.review', 'review')
      .skip((page - 1) * limit).take(limit)
      .orderBy(`wo.${sortBy}`, sortOrder);

    if (status) qb.andWhere('wo.status = :status', { status });
    if (workerId) qb.andWhere('wo.worker_id = :workerId', { workerId });
    if (propertyId) qb.andWhere('wo.property_id = :propertyId', { propertyId });
    if (landlordId) qb.andWhere('property.landlord_id = :landlordId', { landlordId });
    if (tenantId) qb.andWhere('wo.tenant_id = :tenantId', { tenantId });
    if (issueId) qb.andWhere('wo.issue_id = :issueId', { issueId });
    if (buildingId) qb.andWhere('property.building_id = :buildingId', { buildingId });
    if (blockId) qb.andWhere('building.block_id = :blockId', { blockId });
    if (dateFrom) qb.andWhere('wo.created_at >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('wo.created_at <= :dateTo', { dateTo });
    if (search) {
      qb.andWhere(
        '(wo.id::text ILIKE :search OR property.unit_number ILIKE :search OR issue.description ILIKE :search OR worker.name ILIKE :search OR tenant.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportWorkOrders(filterDto: FilterWorkOrderDto) {
    const { page, limit, ...filters } = filterDto;
    const result = await this.findAllWorkOrders({ ...filters, page: 1, limit: 5000 });
    return result.data;
  }

  async createWorkOrder(staffId: number, body: CreateWorkOrderDto) {
    const staff = await this.findStaff(staffId);
    const issue = await this.findIssue(body.issue_id);
    const property = await this.findProperty(body.property_id);
    const landlord = await this.findLandlord(body.landlord_id);

    if (!property.landlord || property.landlord.id !== landlord.id) {
      throw new BadRequestException('Property does not belong to this landlord');
    }

    let tenant: TenantEntity | null = null;
    if (body.tenant_id) {
      tenant = await this.findTanent(body.tenant_id);
      if (!tenant.property || tenant.property.id !== property.id) {
        throw new BadRequestException('Tenant is not associated with this property');
      }
      if (!tenant.approved_by || tenant.approved_by.id !== landlord.id) {
        throw new BadRequestException('Tenant not approved by the provided landlord');
      }
      if (tenant.status !== TenantStatus.APPROVED) {
        throw new BadRequestException('Tenant is not approved');
      }
    }

    // Auto-link Issue to Property/Tenant if missing
    if (!issue.property) { issue.property = property; await this.issueRepo.save(issue); }
    if (!issue.tenant) { issue.tenant = tenant || issue.tenant; await this.issueRepo.save(issue); }

    const workOrder = this.workOrderRepo.create({
      issue, property, landlord, tenant: tenant ?? null, staff,
      created_by_type: 'staff', created_by_id: staff.id,
      status: OrderStatus.PENDING, labor_cost: 0, materials_cost: 0, additional_cost: 0,
    });

    // Update Issue Status to IN_PROGRESS
    if (issue.status === IssueStatus.OPEN) {
      issue.status = IssueStatus.IN_PROGRESS;
      await this.issueRepo.save(issue);
    }

    return await this.workOrderRepo.save(workOrder);
  }

  async updateWorkOrder(id: number, dto: UpdateWorkOrderDto) {
    const order = await this.findWOrkOrder(id);

    if (order.status === OrderStatus.COMPLETE && !dto.status) {
      throw new BadRequestException('Cannot update a completed work order. Reopen it first.');
    }

    if (dto.status && dto.status !== order.status) {
      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.ASSIGNED, OrderStatus.COMPLETE],
        [OrderStatus.ASSIGNED]: [OrderStatus.TENANT_CONFIRMED, OrderStatus.PENDING, OrderStatus.COMPLETE],
        [OrderStatus.TENANT_CONFIRMED]: [OrderStatus.COMPLETE, OrderStatus.ASSIGNED],
        [OrderStatus.COMPLETE]: [],
      };
      if (!validTransitions[order.status]?.includes(dto.status)) {
        throw new BadRequestException(`Invalid status transition from ${order.status} to ${dto.status}`);
      }
      order.status = dto.status;
      if (dto.status === OrderStatus.COMPLETE) order.completed_at = new Date();
    }

    if (dto.labor_cost !== undefined) order.labor_cost = dto.labor_cost;
    if (dto.materials_cost !== undefined) order.materials_cost = dto.materials_cost;
    if (dto.additional_cost !== undefined) order.additional_cost = dto.additional_cost;
    if (dto.notes !== undefined) order.notes = dto.notes; // Requires 'notes' column on WorkOrder Entity

    return await this.workOrderRepo.save(order);
  }

  async dispatchWorker(workOrderId: number, dto: DispatchWorkerDto) {
    const order = await this.findWOrkOrder(workOrderId);
    const worker = await this.findWorker(dto.worker_id);

    if (order.status === OrderStatus.COMPLETE || order.status === OrderStatus.TENANT_CONFIRMED) {
      throw new BadRequestException('The order is already complete or confirmed.');
    }
    if (order.worker) throw new BadRequestException('The order already has a worker. Remove current worker first.');
    if (worker.status !== WorkerStatus.FREE) throw new BadRequestException('Worker is not available for dispatch');

    // Optional: Area Matching Logic
    // if (worker.worker_area && order.property.building?.block?.name !== worker.worker_area) { ... }

    order.worker = worker;
    order.status = OrderStatus.ASSIGNED;
    worker.status = WorkerStatus.BUSY;

    await this.workerRepo.save(worker);
    await this.workOrderRepo.save(order);
    return this.findWOrkOrder(workOrderId);
  }

  async removeWorkerFromOrder(id: number) {
    const order = await this.workOrderRepo.findOne({ where: { id }, relations: { worker: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (!order.worker) throw new BadRequestException('No worker assigned');

    const workerId = order.worker.id;
    const otherActiveCount = await this.workOrderRepo.count({
      where: { worker: { id: workerId }, status: Not(OrderStatus.COMPLETE), id: Not(id) },
    });

    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (worker) {
      worker.status = otherActiveCount === 0 ? WorkerStatus.FREE : WorkerStatus.BUSY;
      await this.workerRepo.save(worker);
    }

    order.worker = null;
    order.status = OrderStatus.PENDING;
    return await this.workOrderRepo.save(order);
  }

  async completeWorkOrder(id: number, dto: CompleteWorkOrderDto) {
    const order = await this.workOrderRepo.findOne({ where: { id }, relations: { worker: true, property: true, landlord: true, tenant: true } });
    if (!order) throw new NotFoundException('Work order not found');
    if (order.status === OrderStatus.COMPLETE) throw new BadRequestException('Order already completed');

    order.labor_cost += dto.labor_cost || 0;
    order.materials_cost += dto.materials_cost || 0;
    order.additional_cost += dto.additional_cost || 0;
    order.status = OrderStatus.COMPLETE;
    order.completed_at = new Date();

    // Create Transaction for Landlord (Expense)
    const totalCost = order.labor_cost + order.materials_cost + order.additional_cost;
    if (totalCost > 0) {
      const txn = this.transactionRepo.create({
        type: Trnsaction_type.work_order_cost, amount: totalCost,
        property_id: order.property, landlord: order.landlord,
        tenant_id: order.tenant ?? null, work_order_id: order,
        payer_type: payer_type.landlord, status: TxnStatus.pending,
        created_by_type: created_by_type.staff,
      });
      await this.transactionRepo.save(txn);
    }

    // Update Worker Status
    if (order.worker) {
      const worker = await this.workerRepo.findOne({ where: { id: order.worker.id } });
      if (worker) {
        const otherActiveCount = await this.workOrderRepo.count({
          where: { worker: { id: worker.id }, status: Not(OrderStatus.COMPLETE), id: Not(id) },
        });
        worker.status = otherActiveCount === 0 ? WorkerStatus.FREE : WorkerStatus.BUSY;
        await this.workerRepo.save(worker);
      }
    }

    // Update Issue Status to RESOLVED
    if (order.issue && order.issue.status !== IssueStatus.RESOLVED) {
      order.issue.status = IssueStatus.RESOLVED;
      await this.issueRepo.save(order.issue);
    }

    return await this.workOrderRepo.save(order);
  }

  async tenantConfirmWorkOrder(id: number) {
    const order = await this.findWOrkOrder(id);
    if (order.status !== OrderStatus.ASSIGNED) throw new BadRequestException('Only assigned orders can be confirmed by tenant');
    order.status = OrderStatus.TENANT_CONFIRMED;
    return await this.workOrderRepo.save(order);
  }

  async reopenWorkOrder(id: number) {
    const order = await this.findWOrkOrder(id);
    if (order.status !== OrderStatus.COMPLETE) throw new BadRequestException('Only completed orders can be reopened');
    order.status = OrderStatus.PENDING;
    order.completed_at = null;
    if (order.worker) {
      const worker = await this.workerRepo.findOne({ where: { id: order.worker.id } });
      if (worker) { worker.status = WorkerStatus.BUSY; await this.workerRepo.save(worker); }
    }
    // Reopen Issue
    if (order.issue) { order.issue.status = IssueStatus.IN_PROGRESS; await this.issueRepo.save(order.issue); }
    return await this.workOrderRepo.save(order);
  }

  async deleteOrder(id: number) {
    const order = await this.workOrderRepo.findOne({ where: { id }, relations: { worker: true } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    if (order.worker) {
      const workerId = order.worker.id;
      const otherActiveCount = await this.workOrderRepo.count({ where: { worker: { id: workerId }, status: Not(OrderStatus.COMPLETE), id: Not(id) } });
      const worker = await this.workerRepo.findOne({ where: { id: workerId } });
      if (worker) { worker.status = otherActiveCount === 0 ? WorkerStatus.FREE : WorkerStatus.BUSY; await this.workerRepo.save(worker); }
    }

    await this.workOrderRepo.delete(id);
    return { message: `Order ${id} has been deleted` };
  }

  // ==========================================
  // ISSUE MANAGEMENT (TRIAGE)
  // ==========================================
  async findAllIssues(filterDto: FilterWorkOrderDto) {
    const { status, propertyId, tenantId, buildingId, blockId, dateFrom, dateTo, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = filterDto;
    const qb = this.issueRepo.createQueryBuilder('issue')
      .leftJoinAndSelect('issue.tenant', 'tenant')
      .leftJoinAndSelect('issue.property', 'property')
      .leftJoinAndSelect('property.landlord', 'landlord')
      .leftJoinAndSelect('property.building', 'building')
      .leftJoinAndSelect('building.block', 'block')
      .skip((page - 1) * limit).take(limit)
      .orderBy(`issue.${sortBy}`, sortOrder);

    if (status) qb.andWhere('issue.status = :status', { status });
    if (propertyId) qb.andWhere('issue.property_id = :propertyId', { propertyId });
    if (tenantId) qb.andWhere('issue.tenant_id = :tenantId', { tenantId });
    if (buildingId) qb.andWhere('property.building_id = :buildingId', { buildingId });
    if (blockId) qb.andWhere('building.block_id = :blockId', { blockId });
    if (dateFrom) qb.andWhere('issue.created_at >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('issue.created_at <= :dateTo', { dateTo });
    if (search) qb.andWhere('(issue.description ILIKE :search OR tenant.name ILIKE :search)', { search: `%${search}%` });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateIssueStatus(id: number, dto: IssueStatusDto) {
    const issue = await this.findIssue(id);
    issue.status = dto.status;
    await this.issueRepo.save(issue);
    return issue;
  }

  async convertIssueToWorkOrder(issueId: number, staffId: number, dto: ConvertIssueDto) {
    const issue = await this.findIssue(issueId);
    if (issue.status === IssueStatus.RESOLVED) throw new BadRequestException('Issue already resolved');

    const staff = await this.findStaff(staffId);
    const property = issue.property || await this.findProperty(dto.property_id);
    if (!property) throw new BadRequestException('Property is required to create Work Order');

    const landlord = property.landlord;

    const workOrder = this.workOrderRepo.create({
      issue, property, landlord, tenant: issue.tenant, staff,
      created_by_type: 'staff', created_by_id: staff.id,
      status: OrderStatus.PENDING, labor_cost: 0, materials_cost: 0, additional_cost: 0,
    });

    issue.status = IssueStatus.IN_PROGRESS;
    await this.issueRepo.save(issue);
    return await this.workOrderRepo.save(workOrder);
  }

  // ==========================================
  // CONTEXTUAL READ ACCESS (Hierarchy)
  // ==========================================
  async getAllProperties(query: any) {
    const { page = 1, limit = 10, status, listingStatus, buildingId, blockId, search } = query;
    const qb = this.propertyRepo.createQueryBuilder('prop')
      .leftJoinAndSelect('prop.landlord', 'landlord')
      .leftJoinAndSelect('prop.building', 'building')
      .leftJoinAndSelect('building.block', 'block')
      .leftJoinAndSelect('prop.tenant', 'tenant')
      .skip((page - 1) * limit).take(limit)
      .orderBy('prop.created_at', 'DESC');

    if (status) qb.andWhere('prop.status = :status', { status });
    if (listingStatus) qb.andWhere('prop.listing_status = :listingStatus', { listingStatus });
    if (buildingId) qb.andWhere('prop.building_id = :buildingId', { buildingId });
    if (blockId) qb.andWhere('building.block_id = :blockId', { blockId });
    if (search) qb.andWhere('(prop.unit_number ILIKE :search OR landlord.name ILIKE :search)', { search: `%${search}%` });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAllBuildings(query: any) {
    const { page = 1, limit = 10, blockId, search } = query;
    const qb = this.buildingRepo.createQueryBuilder('bld')
      .leftJoinAndSelect('bld.block', 'block')
      .leftJoinAndSelect('bld.created_by', 'admin')
      .skip((page - 1) * limit).take(limit)
      .orderBy('bld.created_at', 'DESC');
    if (blockId) qb.andWhere('bld.block_id = :blockId', { blockId });
    if (search) qb.andWhere('(bld.name ILIKE :search OR block.name ILIKE :search)', { search: `%${search}%` });
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAllBlocks(query: any) {
    const { page = 1, limit = 10, search } = query;
    const qb = this.blockRepo.createQueryBuilder('blk')
      .leftJoinAndSelect('blk.created_by', 'admin')
      .skip((page - 1) * limit).take(limit)
      .orderBy('blk.created_at', 'DESC');
    if (search) qb.andWhere('(blk.name ILIKE :search OR blk.address ILIKE :search)', { search: `%${search}%` });
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAllTenants(query: any) {
    const { page = 1, limit = 10, status, propertyId, search } = query;
    const qb = this.tenantRepo.createQueryBuilder('tn')
      .leftJoinAndSelect('tn.property', 'property')
      .leftJoinAndSelect('property.landlord', 'landlord')
      .leftJoinAndSelect('tn.approved_by', 'approvedBy')
      .skip((page - 1) * limit).take(limit)
      .orderBy('tn.created_at', 'DESC');
    if (status) qb.andWhere('tn.status = :status', { status });
    if (propertyId) qb.andWhere('tn.property_id = :propertyId', { propertyId });
    if (search) qb.andWhere('(tn.name ILIKE :search OR tn.email ILIKE :search)', { search: `%${search}%` });
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAllAdmins() {
    return this.adminRepo.find({ relations: { landlords: true, staff: true, blocks: true, buildings: true } });
  }

  // ==========================================
  // TRANSACTIONS & FINANCIALS
  // ==========================================
  async getTransactions(filterDto: FilterTransactionDto) {
    const { type, status, payerType, propertyId, workOrderId, landlordId, tenantId, dateFrom, dateTo, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = filterDto;
    const qb = this.transactionRepo.createQueryBuilder('txn')
      .leftJoinAndSelect('txn.property_id', 'property')
      .leftJoinAndSelect('txn.landlord', 'landlord')
      .leftJoinAndSelect('txn.tenant_id', 'tenant')
      .leftJoinAndSelect('txn.work_order_id', 'workOrder')
      .skip((page - 1) * limit).take(limit)
      .orderBy(`txn.${sortBy}`, sortOrder);

    if (type) qb.andWhere('txn.type = :type', { type });
    if (status) qb.andWhere('txn.status = :status', { status });
    if (payerType) qb.andWhere('txn.payer_type = :payerType', { payerType });
    if (propertyId) qb.andWhere('txn.property_id = :propertyId', { propertyId });
    if (workOrderId) qb.andWhere('txn.work_order_id = :workOrderId', { workOrderId });
    if (landlordId) qb.andWhere('txn.landlord_id = :landlordId', { landlordId });
    if (tenantId) qb.andWhere('txn.tenant_id = :tenantId', { tenantId });
    if (dateFrom) qb.andWhere('txn.created_at >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('txn.created_at <= :dateTo', { dateTo });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createTransaction(staffId: number, dto: CreateTransactionDto) {
    const staff = await this.findStaff(staffId);
    const property = await this.findProperty(dto.property_id);
    const landlord = property.landlord;

    let tenant: TenantEntity | null = null;
    if (dto.tenant_id) tenant = await this.findTanent(dto.tenant_id);

    let workOrder: WorkOrder | null = null;
    if (dto.work_order_id) workOrder = await this.findWOrkOrder(dto.work_order_id);

    const txn = this.transactionRepo.create({
      type: dto.type, amount: dto.amount, property_id: property, landlord,
      tenant_id: tenant, work_order_id: workOrder,
      payer_type: dto.payer_type, status: dto.status || TxnStatus.pending,
      created_by_type: created_by_type.staff,
    });

    if (dto.status === TxnStatus.paid) txn.paid_at = new Date();

    return await this.transactionRepo.save(txn);
  }

  async getWorkOrderTransactions(workOrderId: number) {
    await this.findWOrkOrder(workOrderId);
    return this.transactionRepo.find({
      where: { work_order_id: { id: workOrderId } },
      relations: { property_id: true, landlord: true, tenant_id: true },
      order: { created_at: 'DESC' }
    });
  }

  async getFinancialSummary(filterDto: FilterTransactionDto) {
    const { dateFrom, dateTo } = filterDto;
    const qb = this.transactionRepo.createQueryBuilder('txn')
      .select('txn.type', 'type')
      .addSelect('txn.status', 'status')
      .addSelect('txn.payer_type', 'payerType')
      .addSelect('SUM(txn.amount)', 'totalAmount')
      .addSelect('COUNT(txn.id)', 'count')
      .groupBy('txn.type, txn.status, txn.payer_type');

    if (dateFrom) qb.andWhere('txn.created_at >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('txn.created_at <= :dateTo', { dateTo });

    const raw = await qb.getRawMany();
    return raw.map(r => ({
      type: r.type, status: r.status, payerType: r.payerType,
      totalAmount: parseFloat(r.totalAmount), count: parseInt(r.count),
    }));
  }

  async getWorkOrderSummaryReport(filterDto: FilterWorkOrderDto) {
    const { dateFrom, dateTo, status } = filterDto;
    const qb = this.workOrderRepo.createQueryBuilder('wo')
      .select('wo.status', 'status')
      .addSelect('COUNT(wo.id)', 'count')
      .addSelect('AVG(wo.labor_cost + wo.materials_cost + wo.additional_cost)', 'avgCost')
      .addSelect('SUM(wo.labor_cost + wo.materials_cost + wo.additional_cost)', 'totalCost')
      .groupBy('wo.status');

    if (dateFrom) qb.andWhere('wo.created_at >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('wo.created_at <= :dateTo', { dateTo });
    if (status) qb.andWhere('wo.status = :status', { status });

    const raw = await qb.getRawMany();
    return raw.map(r => ({
      status: r.status, count: parseInt(r.count),
      avgCost: parseFloat(r.avgCost || 0), totalCost: parseFloat(r.totalCost || 0),
    }));
  }

  // ==========================================
  // REVIEWS & LANDLORDS
  // ==========================================
  async getReviewByOrder(id: number) {
    const order = await this.workOrderRepo.findOne({ where: { id }, relations: { review: { tenant: true } } });
    if (!order) throw new NotFoundException(`Work order ${id} not found`);
    if (!order.review) throw new NotFoundException(`Review for work order ${id} not found`);
    return order.review;
  }

  async deleteReview(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.reviewRepo.delete(id);
    return { message: 'Review successfully deleted', deletedId: id };
  }

  async getAllLandLoards() {
    return await this.landlordRepo.find({ relations: { properties: { building: { block: true } }, tenants: true } });
  }
}
