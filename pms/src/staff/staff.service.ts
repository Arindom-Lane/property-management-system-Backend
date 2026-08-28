import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Any } from 'typeorm';
import { staffDto } from './dto/staff.dto';
import { WorkerEntity, WorkerStatus } from './entities/worker.entity';
import { WorkOrder, OrderStatus } from './entities/work_order.entity';
import { ReviewEntity } from './entities/review.entity';
import { StaffEntity } from './entities/staff.entity';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from '../admin/entities/admin.entity';
import { CreateWorkOrderDto } from './dto/CreateWorkOrder.dto';
import { IssueEntity, IssueStatus } from '../tenant/entities/issue.entity';
import {
  PropertyEntity,
  Status as PropertyStatus,
} from '../landlord/entities/property.entity';
import {
  LandlordEntity,
  LandlordStatus,
} from '../landlord/entities/landlord.entity';
import { TenantEntity, TenantStatus } from '../tenant/entities/tenant.entity';
import { DispatchWorkerDto } from './dto/DispatchWorkOrder.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { CompleteWorkOrderDto } from './dto/CompleteWorkOrder.dto';
import { UpdateWorkOrderDto } from './dto/UpdateWorkOrder.dto';
import { FilterWorkOrderDto } from './dto/FilterWorkOrder.dto';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';
import { FilterWorkerDto } from './dto/FilterWorker.dto';
import { IssueStatusDto } from './dto/IssueStatus.dto';
import { ConvertIssueDto } from './dto/ConvertIssue.dto';
import {
  TransactionEntity,
  Trnsaction_type,
  payer_type,
  status as TxnStatus,
  created_by_type,
} from '../landlord/entities/transaction.entity';
import { BlockEntity } from '../admin/entities/block.entity';
import { BuildingEntity } from '../admin/entities/building.entity';
import { CreateAdminDto } from '../admin/dto/admin.dto';
import { LoginStaffDto } from "./dto/LoginStaff.dto"
import { empty } from 'rxjs';
import { IsEmail } from 'class-validator';


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
  ) {}

  async findAdmin(id: number) {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: {
        landlords: true,
        staff: true,
        blocks: true,
        buildings: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }

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

    if (!workOrder) {
      throw new NotFoundException('WorkOrder not found!');
    }

    return workOrder;
  }

  async findStaff(id: number) {
    const staff = await this.staffRepo.findOne({
      where: { id },
      relations: { created_by: true },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found!');
    }

    return staff;
  }

  async findIssue(id: number) {
    const issue = await this.issueRepo.findOne({
      where: { id },
      relations: {
        tenant: { property: true },
        property: { landlord: true },
      },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found!');
    }

    return issue;
  }

  async findProperty(id: number) {
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: {
        landlord: true,
        tenant: true,
        transactions: true,
        workOrders: { worker: true, review: true },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found!');
    }

    return property;
  }

  async findLandlord(id: number) {
    const landlord = await this.landlordRepo.findOne({
      where: { id },
      relations: {
        properties: true,
        tenants: true,
      },
    });

    if (!landlord) {
      throw new NotFoundException('Landlord not found!');
    }

    return landlord;
  }

  async findTanent(id: number) {
    const tenant = await this.tenantRepo.findOne({
      where: { id },
      relations: {
        property: { landlord: true },
        approved_by: true,
        issues: true,
        reviews: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found!');
    }

    return tenant;
  }

  async findWorker(id: number) {
    const worker = await this.workerRepo.findOne({
      where: { id },
      relations: {
        created_by: true,
        workOrders: {
          property: { landlord: true },
          review: true,
        },
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found!');
    }

    return worker;
  }

  async findBuilding(id: number) {
    const building = await this.buildingRepo.findOne({
      where: { id },
      relations: {
        properties: true,
        created_by: true,
      },
    });

    if (!building) {
      throw new NotFoundException('Building not found!');
    }

    return building;
  }

  async findBlock(id: number) {
    const block = await this.blockRepo.findOne({
      where: { id },
      relations: {
        created_by: true,
        building: true,
      },
    });

    if (!block) {
      throw new NotFoundException('Block not found!');
    }

    return block;
  }
 // admins work
  async createStaff(data: staffDto): Promise<StaffEntity> {
    const existing = await this.staffRepo.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });

    if (existing) {
      throw new ForbiddenException('Staff with email or phone already exists');
    }

    const saltRounds = 10;
    let admin: AdminEntity | null = null;
    const hashedPassword = await bcrypt.hash(data.password_hash, saltRounds);
    if(data.created_by){
        admin = await this.findAdmin(data.created_by);
    }
  
    const staff = this.staffRepo.create({
      ...data,
      password_hash: hashedPassword,
      created_by: admin,
    });

    await this.staffRepo.save(staff);

    return staff;
  }

  async loginStaff(dto: LoginStaffDto ) {
    const staff = await this.staffRepo.findOne({
      where: { email: dto.email },
    });

    if (!staff) {
      throw new NotFoundException('not found');
    }

    const isPasswordCorrect = await bcrypt.compare(
      dto.password,
      staff.password_hash,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid');
    }

    const Objstaff = {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      phone: staff.phone,
      status: staff.status
    }
    return Objstaff;
  }

  async findStaffByEmail(email: string) {
    return await this.staffRepo.findOne({
      where: { email },
    });
  }

  async viewAllStaff() {
    return await this.staffRepo.find({
      relations: { created_by: true },
    });
  }

  async deleteStaff(id: number) {
    const staff = await this.staffRepo.findOne({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    await this.staffRepo.delete(id);

    return { message: `${staff.id} deleted` };
  }

  async getDashboardStats(staffId: number) {
    await this.findStaff(staffId);

    const totalWorkOrders = await this.workOrderRepo.count();

    const pendingWorkOrders = await this.workOrderRepo.count({
      where: { status: OrderStatus.PENDING },
    });

    const assignedWorkOrders = await this.workOrderRepo.count({
      where: { status: OrderStatus.ASSIGNED },
    });

    const inProgressWorkOrders = await this.workOrderRepo.count({
      where: { status: OrderStatus.TENANT_CONFIRMED },
    });

    const completedWorkOrders = await this.workOrderRepo.count({
      where: { status: OrderStatus.COMPLETE },
    });

    const totalWorkers = await this.workerRepo.count();

    const freeWorkers = await this.workerRepo.count({
      where: { status: WorkerStatus.FREE },
    });

    const busyWorkers = await this.workerRepo.count({
      where: { status: WorkerStatus.BUSY },
    });

    const openIssues = await this.issueRepo.count({
      where: { status: IssueStatus.OPEN },
    });

    const inProgressIssues = await this.issueRepo.count({
      where: { status: IssueStatus.IN_PROGRESS },
    });

    const totalProperties = await this.propertyRepo.count();

    const occupiedProperties = await this.propertyRepo.count({
      where: { status: PropertyStatus.OCCUPIED },
    });

    const vacantProperties = await this.propertyRepo.count({
      where: { status: PropertyStatus.VACANT },
    });

    const totalLandlords = await this.landlordRepo.count({
      where: { status: LandlordStatus.active },
    });

    const totalTenants = await this.tenantRepo.count({
      where: { status: TenantStatus.APPROVED },
    });

    const totalBlocks = await this.blockRepo.count();
    const totalBuildings = await this.buildingRepo.count();

    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await this.transactionRepo
      .createQueryBuilder('txn')
      .select('SUM(txn.amount)', 'total')
      .where('txn.type = :type', {
        type: Trnsaction_type.work_order_cost,
      })
      .andWhere('txn.status = :status', {
        status: TxnStatus.paid,
      })
      .andWhere('txn.paid_at >= :date', {
        date: startOfMonth,
      })
      .getRawOne();

    const monthlyRent = await this.transactionRepo
      .createQueryBuilder('txn')
      .select('SUM(txn.amount)', 'total')
      .where('txn.type IN (:...types)', {
        types: [
          Trnsaction_type.rent,
          Trnsaction_type.service_charge,
          Trnsaction_type.parking,
        ],
      })
      .andWhere('txn.status = :status', {
        status: TxnStatus.paid,
      })
      .andWhere('txn.paid_at >= :date', {
        date: startOfMonth,
      })
      .getRawOne();

    let monthlyWorkOrderRevenue = 0;
    let monthlyRentCollected = 0;

    if (monthlyRevenue && monthlyRevenue.total) {
      monthlyWorkOrderRevenue = parseFloat(monthlyRevenue.total);
    }

    if (monthlyRent && monthlyRent.total) {
      monthlyRentCollected = parseFloat(monthlyRent.total);
    }

    return {
      workOrders: {
        total: totalWorkOrders,
        pending: pendingWorkOrders,
        assigned: assignedWorkOrders,
        inProgress: inProgressWorkOrders,
        completed: completedWorkOrders,
      },

      workers: {
        total: totalWorkers,
        free: freeWorkers,
        busy: busyWorkers,
      },

      issues: {
        open: openIssues,
        inProgress: inProgressIssues,
      },

      properties: {
        total: totalProperties,
        occupied: occupiedProperties,
        vacant: vacantProperties,
      },

      landlords: {
        total: totalLandlords,
      },

      tenants: {
        total: totalTenants,
      },

      hierarchy: {
        blocks: totalBlocks,
        buildings: totalBuildings,
      },

      financials: {
        monthlyWorkOrderRevenue,
        monthlyRentCollected,
      },
    };
  }

  async getWorkloadOverview(staffId: number) {
    await this.findStaff(staffId);

    const workers = await this.workerRepo.find({
      relations: { workOrders: true },
    });

    const workerLoad: any[] = [];

    for (const worker of workers) {
      let activeOrders = 0;
      let completedOrders = 0;

      for (const order of worker.workOrders) {
        if (order.status === OrderStatus.COMPLETE) {
          completedOrders++;
        } else {
          activeOrders++;
        }
      }

      workerLoad.push({
        id: worker.id,
        name: worker.name,
        area: worker.worker_area,
        status: worker.status,
        activeOrders,
        completedOrders,
      });
    }

    const properties = await this.propertyRepo.find({
      relations: {
        workOrders: true,
        issues: true,
        building: true,
        tenant: true,
      },
    });

    const propertyLoad: any[] = [];

    for (const property of properties) {
      let openWorkOrders = 0;
      let openIssues = 0;

      for (const order of property.workOrders) {
        if (order.status !== OrderStatus.COMPLETE) {
          openWorkOrders++;
        }
      }

      for (const issue of property.issues) {
        if (issue.status !== IssueStatus.RESOLVED) {
          openIssues++;
        }
      }

      if (
        openWorkOrders > 0 ||
        openIssues > 0 ||
        property.status === PropertyStatus.VACANT
      ) {
        let tenantName = 'Vacant';

        if (property.tenant) {
          tenantName = property.tenant.name;
        }

        let buildingName: string | null = null;

        if (property.building) {
          buildingName = property.building.name;
        }

        propertyLoad.push({
          id: property.id,
          unit: property.unit_number,
          building: buildingName,
          status: property.status,
          listing: property.listing_status,
          openWorkOrders,
          openIssues,
          currentTenant: tenantName,
        });
      }
    }

    return {
      workerLoad,
      propertyLoad,
    };
  }

  async createWorker(
    staffId: number,
    data: CreateWorkerDto,
  ): Promise<WorkerEntity> {
    const staff = await this.findStaff(staffId);

    const exists = await this.workerRepo.findOne({
      where: { email: data.email },
    });

    if (exists) {
      throw new BadRequestException('Worker email already exists');
    }

    const newWorker = this.workerRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      worker_area: data.worker_area,
      status: data.status || WorkerStatus.FREE,
      created_by: staff,
    });

    await this.workerRepo.save(newWorker);

    return newWorker;
  }

  async findAllWorkers(filterDto: FilterWorkerDto) {
    let page = filterDto.page;
    let limit = filterDto.limit;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const qb = this.workerRepo
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.created_by', 'staff')
      .skip((page - 1) * limit)
      .take(limit);

    if (filterDto.status) {
      qb.andWhere('worker.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.area) {
      qb.andWhere('worker.worker_area = :area', {
        area: filterDto.area,
      });
    }

    if (filterDto.search) {
      qb.andWhere(
        '(worker.name ILIKE :search OR worker.email ILIKE :search OR worker.phone ILIKE :search)',
        {
          search: `%${filterDto.search}%`,
        },
      );
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateWorker(id: number, body: UpdateWorkerDto) {
    const worker = await this.findWorker(id);

    if (body.name !== undefined) {
      worker.name = body.name;
    }

    if (body.email !== undefined) {
      worker.email = body.email;
    }

    if (body.phone !== undefined) {
      worker.phone = body.phone;
    }

    if (body.worker_area !== undefined) {
      worker.worker_area = body.worker_area;
    }

    if (body.status !== undefined) {
      worker.status = body.status;
    }

    await this.workerRepo.save(worker);

    return await this.findWorker(id);
  }

  async toggleWorkerStatus(id: number) {
    const worker = await this.findWorker(id);

    if (worker.status === WorkerStatus.FREE) {
      worker.status = WorkerStatus.BUSY;
    } else {
      worker.status = WorkerStatus.FREE;
    }

    await this.workerRepo.save(worker);

    return worker;
  }

  async deleteWorker(id: number) {
    const worker = await this.findWorker(id);

    const activeOrders = await this.workOrderRepo.count({
      where: {
        worker: { id },
        status: Not(OrderStatus.COMPLETE),
      },
    });

    if (activeOrders > 0) {
      throw new BadRequestException(
        `Cannot delete worker. They have ${activeOrders} active work orders.`,
      );
    }

    await this.workerRepo.remove(worker);

    return {
      message: `${worker.name} has been deleted`,
    };
  }

  async getWorkerSchedule(id: number) {
    const worker = await this.findWorker(id);

    const orders = await this.workOrderRepo.find({
      where: {
        worker: { id },
        status: Not(OrderStatus.COMPLETE),
      },
      relations: {
        property: {
          landlord: true,
        },
        issue: true,
        tenant: true,
      },
      order: {
        created_at: 'ASC',
      },
    });

    return {
      worker: {
        id: worker.id,
        name: worker.name,
        area: worker.worker_area,
        status: worker.status,
      },
      schedule: orders,
    };
  }

  async getWorkerPerformance(id: number) {
    const worker = await this.findWorker(id);

    const completedOrders = await this.workOrderRepo.find({
      where: {
        worker: { id },
        status: OrderStatus.COMPLETE,
      },
      relations: {
        review: true,
        property: true,
      },
    });

    let totalRating = 0;
    let ratedOrders = 0;
    let totalRevenue = 0;

    for (const order of completedOrders) {
      totalRevenue =
        totalRevenue +
        order.labor_cost +
        order.materials_cost +
        order.additional_cost;

      if (order.review) {
        totalRating = totalRating + parseInt(order.review.rating, 10);
        ratedOrders++;
      }
    }

    let averageRating = 0;

    if (ratedOrders > 0) {
      averageRating = totalRating / ratedOrders;
    }

    const recentOrders: any[] = [];

    let startIndex = completedOrders.length - 5;

    if (startIndex < 0) {
      startIndex = 0;
    }

    for (let i = startIndex; i < completedOrders.length; i++) {
      const order = completedOrders[i];

      let propertyUnit: string | null = null;
      let rating: string | null = null;

      if (order.property) {
        propertyUnit = order.property.unit_number;
      }

      if (order.review) {
        rating = order.review.rating;
      }

      recentOrders.push({
        id: order.id,
        property: propertyUnit,
        cost: order.labor_cost + order.materials_cost + order.additional_cost,
        rating,
      });
    }

    return {
      worker: {
        id: worker.id,
        name: worker.name,
        area: worker.worker_area,
      },

      stats: {
        totalCompleted: completedOrders.length,
        ratedCount: ratedOrders,
        averageRating: Number(averageRating.toFixed(2)),
        totalRevenueGenerated: totalRevenue,
      },

      recentOrders,
    };
  }

  async getWorkerPerformanceReport(query: any) {
    const workers = await this.workerRepo.find({
      relations: {
        workOrders: {
          review: true,
          property: true,
        },
      },
    });

    const report: any[] = [];

    for (const worker of workers) {
      let completedCount = 0;
      let ratingTotal = 0;
      let ratedCount = 0;
      let totalRevenue = 0;

      for (const order of worker.workOrders) {
        if (order.status === OrderStatus.COMPLETE) {
          completedCount++;

          totalRevenue =
            totalRevenue +
            order.labor_cost +
            order.materials_cost +
            order.additional_cost;

          if (order.review) {
            ratingTotal = ratingTotal + parseInt(order.review.rating, 10);

            ratedCount++;
          }
        }
      }

      let averageRating = 0;

      if (ratedCount > 0) {
        averageRating = ratingTotal / ratedCount;
      }

      report.push({
        id: worker.id,
        name: worker.name,
        status: worker.status,
        completedCount,
        avgRating: averageRating.toFixed(2),
        totalRevenue,
      });
    }

    return {
      data: report,
      total: report.length,
    };
  }

  async findAllWorkOrders(filterDto: FilterWorkOrderDto) {
    let page = filterDto.page;
    let limit = filterDto.limit;
    let sortBy = filterDto.sortBy;
    let sortOrder = filterDto.sortOrder;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    if (!sortBy) {
      sortBy = 'created_at';
    }

    if (!sortOrder) {
      sortOrder = 'DESC';
    }

    const qb = this.workOrderRepo
      .createQueryBuilder('wo')
      .leftJoinAndSelect('wo.worker', 'worker')
      .leftJoinAndSelect('wo.property', 'property')
      .leftJoinAndSelect('property.landlord', 'landlord')
      .leftJoinAndSelect('property.building', 'building')
      .leftJoinAndSelect('building.block', 'block')
      .leftJoinAndSelect('wo.tenant', 'tenant')
      .leftJoinAndSelect('wo.staff', 'staff')
      .leftJoinAndSelect('wo.issue', 'issue')
      .leftJoinAndSelect('wo.review', 'review')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`wo.${sortBy}`, sortOrder);

    if (filterDto.status) {
      qb.andWhere('wo.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.workerId) {
      qb.andWhere('wo.worker_id = :workerId', {
        workerId: filterDto.workerId,
      });
    }

    if (filterDto.propertyId) {
      qb.andWhere('wo.property_id = :propertyId', {
        propertyId: filterDto.propertyId,
      });
    }

    if (filterDto.landlordId) {
      qb.andWhere('property.landlord_id = :landlordId', {
        landlordId: filterDto.landlordId,
      });
    }

    if (filterDto.tenantId) {
      qb.andWhere('wo.tenant_id = :tenantId', {
        tenantId: filterDto.tenantId,
      });
    }

    if (filterDto.dateFrom) {
      qb.andWhere('wo.created_at >= :dateFrom', {
        dateFrom: filterDto.dateFrom,
      });
    }

    if (filterDto.dateTo) {
      qb.andWhere('wo.created_at <= :dateTo', {
        dateTo: filterDto.dateTo,
      });
    }

    if (filterDto.search) {
      qb.andWhere(
        '(wo.id::text ILIKE :search OR property.unit_number ILIKE :search OR issue.description ILIKE :search OR worker.name ILIKE :search OR tenant.name ILIKE :search)',
        {
          search: `%${filterDto.search}%`,
        },
      );
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async exportWorkOrders(filterDto: FilterWorkOrderDto) {
    filterDto.page = 1;
    filterDto.limit = 5000;

    const result = await this.findAllWorkOrders(filterDto);

    return result.data;
  }

  async createWorkOrder(staffId: number, body: CreateWorkOrderDto) {
    const staff = await this.findStaff(staffId);
    const issue = await this.findIssue(body.issue_id);
    const property = await this.findProperty(body.property_id);
    const landlord = await this.findLandlord(body.landlord_id);
    const tenant = await this.findTanent(body.tenant_id);

    if (!property.landlord || property.landlord.id !== landlord.id) {
      throw new BadRequestException(
        'Property does not belong to this landlord',
      );
    }

    if (body.tenant_id) {
      if (!tenant.property || tenant.property.id !== property.id) {
        throw new BadRequestException(
          'Tenant is not associated with this property',
        );
      }

      if (!tenant.approved_by || tenant.approved_by.id !== landlord.id) {
        throw new BadRequestException(
          'Tenant not approved by the provided landlord',
        );
      }

      if (tenant.status !== TenantStatus.APPROVED) {
        throw new BadRequestException('Tenant is not approved');
      }
    }

    if (!issue.property) {
      issue.property = property;
      await this.issueRepo.save(issue);
    }

    if (!issue.tenant) {
      if (tenant) {
        issue.tenant = tenant;
        await this.issueRepo.save(issue);
      }
    }

    const workOrder = this.workOrderRepo.create({
      issue,
      property,
      landlord,
      tenant,
      staff,
      created_by_type: 'staff',
      created_by_id: staff.id,
      status: OrderStatus.PENDING,
      labor_cost: 0,
      materials_cost: 0,
      additional_cost: 0,
    });

    if (issue.status === IssueStatus.OPEN) {
      issue.status = IssueStatus.IN_PROGRESS;
      await this.issueRepo.save(issue);
    }

    return await this.workOrderRepo.save(workOrder);
  }

  async updateWorkOrder(id: number, dto: UpdateWorkOrderDto) {
    const order = await this.findWOrkOrder(id);

    if (order.status === OrderStatus.COMPLETE && !dto.status) {
      throw new BadRequestException(
        'Cannot update a completed work order. Reopen it first.',
      );
    }

    if (dto.status && dto.status !== order.status) {
      let validTransition = false;

      if (order.status === OrderStatus.PENDING) {
        if (
          dto.status === OrderStatus.ASSIGNED ||
          dto.status === OrderStatus.COMPLETE
        ) {
          validTransition = true;
        }
      }

      if (order.status === OrderStatus.ASSIGNED) {
        if (
          dto.status === OrderStatus.TENANT_CONFIRMED ||
          dto.status === OrderStatus.PENDING ||
          dto.status === OrderStatus.COMPLETE
        ) {
          validTransition = true;
        }
      }

      if (order.status === OrderStatus.TENANT_CONFIRMED) {
        if (
          dto.status === OrderStatus.COMPLETE ||
          dto.status === OrderStatus.ASSIGNED
        ) {
          validTransition = true;
        }
      }

      if (order.status === OrderStatus.COMPLETE) {
        validTransition = false;
      }

      if (!validTransition) {
        throw new BadRequestException(
          `Invalid status transition from ${order.status} to ${dto.status}`,
        );
      }

      order.status = dto.status;

      if (dto.status === OrderStatus.COMPLETE) {
        order.completed_at = new Date();
      }
    }

    if (dto.labor_cost !== undefined) {
      order.labor_cost = dto.labor_cost;
    }

    if (dto.materials_cost !== undefined) {
      order.materials_cost = dto.materials_cost;
    }

    if (dto.additional_cost !== undefined) {
      order.additional_cost = dto.additional_cost;
    }

    return await this.workOrderRepo.save(order);
  }

  async dispatchWorker(workOrderId: number, dto: DispatchWorkerDto) {
    const order = await this.findWOrkOrder(workOrderId);
    const worker = await this.findWorker(dto.worker_id);

    if (
      order.status === OrderStatus.COMPLETE ||
      order.status === OrderStatus.TENANT_CONFIRMED
    ) {
      throw new BadRequestException(
        'The order is already complete or confirmed.',
      );
    }

    if (order.worker) {
      throw new BadRequestException(
        'The order already has a worker. Remove current worker first.',
      );
    }

    if (worker.status !== WorkerStatus.FREE) {
      throw new BadRequestException('Worker is not available for dispatch');
    }

    order.worker = worker;
    order.status = OrderStatus.ASSIGNED;
    worker.status = WorkerStatus.BUSY;

    await this.workerRepo.save(worker);
    await this.workOrderRepo.save(order);

    return await this.findWOrkOrder(workOrderId);
  }

  async removeWorkerFromOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { worker: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.worker) {
      throw new BadRequestException('No worker assigned');
    }

    const workerId = order.worker.id;

    const otherActiveCount = await this.workOrderRepo.count({
      where: {
        worker: { id: workerId },
        status: Not(OrderStatus.COMPLETE),
        id: Not(id),
      },
    });

    const worker = await this.workerRepo.findOne({
      where: { id: workerId },
    });

    if (worker) {
      if (otherActiveCount === 0) {
        worker.status = WorkerStatus.FREE;
      } else {
        worker.status = WorkerStatus.BUSY;
      }

      await this.workerRepo.save(worker);
    }

    order.worker = null;
    order.status = OrderStatus.PENDING;

    return await this.workOrderRepo.save(order);
  }

  async completeWorkOrder(id: number, dto: CompleteWorkOrderDto) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: {
        worker: true,
        property: true,
        landlord: true,
        tenant: true,
        issue: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Work order not found');
    }

    if (order.status === OrderStatus.COMPLETE) {
      throw new BadRequestException('Order already completed');
    }

    order.labor_cost += dto.labor_cost || 0;
    order.materials_cost += dto.materials_cost || 0;
    order.additional_cost += dto.additional_cost || 0;
    order.status = OrderStatus.COMPLETE;
    order.completed_at = new Date();

    const totalCost =
      order.labor_cost + order.materials_cost + order.additional_cost;

    if (totalCost > 0) {
      const txn = this.transactionRepo.create({
        type: Trnsaction_type.work_order_cost,
        amount: totalCost,
        property_id: order.property,
        landlord: order.landlord,
        work_order_id: order,
        payer_type: payer_type.landlord,
        status: TxnStatus.pending,
        created_by_type: created_by_type.staff,
      });

      if (order.tenant) {
        txn.tenant_id = order.tenant;
      }



      await this.transactionRepo.save(txn);
    }

    if (order.worker) {
      const worker = await this.workerRepo.findOne({
        where: { id: order.worker.id },
      });

      if (worker) {
        const otherActiveCount = await this.workOrderRepo.count({
          where: {
            worker: { id: worker.id },
            status: Not(OrderStatus.COMPLETE),
            id: Not(id),
          },
        });

        if (otherActiveCount === 0) {
          worker.status = WorkerStatus.FREE;
        } else {
          worker.status = WorkerStatus.BUSY;
        }

        await this.workerRepo.save(worker);
      }
    }

    if (order.issue && order.issue.status !== IssueStatus.RESOLVED) {
      order.issue.status = IssueStatus.RESOLVED;
      await this.issueRepo.save(order.issue);
    }

    return await this.workOrderRepo.save(order);
  }

  async tenantConfirmWorkOrder(id: number) {
    const order = await this.findWOrkOrder(id);

    if (order.status !== OrderStatus.ASSIGNED) {
      throw new BadRequestException(
        'Only assigned orders can be confirmed by tenant',
      );
    }

    order.status = OrderStatus.TENANT_CONFIRMED;

    return await this.workOrderRepo.save(order);
  }

  async reopenWorkOrder(id: number) {
    const order = await this.findWOrkOrder(id);

    if (order.status !== OrderStatus.COMPLETE) {
      throw new BadRequestException('Only completed orders can be reopened');
    }

    order.status = OrderStatus.PENDING;

    if (order.worker) {
      const worker = await this.workerRepo.findOne({
        where: { id: order.worker.id },
      });

      if (worker) {
        worker.status = WorkerStatus.BUSY;
        await this.workerRepo.save(worker);
      }
    }

    if (order.issue) {
      order.issue.status = IssueStatus.IN_PROGRESS;
      await this.issueRepo.save(order.issue);
    }

    return await this.workOrderRepo.save(order);
  }

  async deleteOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { worker: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (order.worker) {
      const workerId = order.worker.id;

      const otherActiveCount = await this.workOrderRepo.count({
        where: {
          worker: { id: workerId },
          status: Not(OrderStatus.COMPLETE),
          id: Not(id),
        },
      });

      const worker = await this.workerRepo.findOne({
        where: { id: workerId },
      });

      if (worker) {
        if (otherActiveCount === 0) {
          worker.status = WorkerStatus.FREE;
        } else {
          worker.status = WorkerStatus.BUSY;
        }

        await this.workerRepo.save(worker);
      }
    }

    await this.workOrderRepo.delete(id);

    return {
      message: `Order ${id} has been deleted`,
    };
  }

  async findAllIssues(filterDto: FilterWorkOrderDto) {
    let page = filterDto.page;
    let limit = filterDto.limit;
    let sortBy = filterDto.sortBy;
    let sortOrder = filterDto.sortOrder;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    if (!sortBy) {
      sortBy = 'created_at';
    }

    if (!sortOrder) {
      sortOrder = 'DESC';
    }

    const qb = this.issueRepo
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.tenant', 'tenant')
      .leftJoinAndSelect('issue.property', 'property')
      .leftJoinAndSelect('property.landlord', 'landlord')
      .leftJoinAndSelect('property.building', 'building')
      .leftJoinAndSelect('building.block', 'block')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`issue.${sortBy}`, sortOrder);

    if (filterDto.status) {
      qb.andWhere('issue.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.propertyId) {
      qb.andWhere('issue.property_id = :propertyId', {
        propertyId: filterDto.propertyId,
      });
    }

    if (filterDto.tenantId) {
      qb.andWhere('issue.tenant_id = :tenantId', {
        tenantId: filterDto.tenantId,
      });
    }

    if (filterDto.dateFrom) {
      qb.andWhere('issue.created_at >= :dateFrom', {
        dateFrom: filterDto.dateFrom,
      });
    }

    if (filterDto.dateTo) {
      qb.andWhere('issue.created_at <= :dateTo', {
        dateTo: filterDto.dateTo,
      });
    }

    if (filterDto.search) {
      qb.andWhere(
        '(issue.description ILIKE :search OR tenant.name ILIKE :search)',
        {
          search: `%${filterDto.search}%`,
        },
      );
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateIssueStatus(id: number, dto: IssueStatusDto) {
    const issue = await this.findIssue(id);

    issue.status = dto.status;

    await this.issueRepo.save(issue);

    return issue;
  }

  async convertIssueToWorkOrder(
    issueId: number,
    staffId: number,
    dto: ConvertIssueDto,
  ) {
    const issue = await this.findIssue(issueId);

    if (issue.status === IssueStatus.RESOLVED) {
      throw new BadRequestException('Issue already resolved');
    }

    const staff = await this.findStaff(staffId);

    let property = issue.property;

    if (!property) {
      property = await this.findProperty(dto.property_id);
    }

    if (!property) {
      throw new BadRequestException(
        'Property is required to create Work Order',
      );
    }

    const landlord = property.landlord;

    const workOrder = this.workOrderRepo.create({
      issue,
      property,
      landlord,
      tenant: issue.tenant,
      staff,
      created_by_type: 'staff',
      created_by_id: staff.id,
      status: OrderStatus.PENDING,
      labor_cost: 0,
      materials_cost: 0,
      additional_cost: 0,
    });

    issue.status = IssueStatus.IN_PROGRESS;

    await this.issueRepo.save(issue);

    return await this.workOrderRepo.save(workOrder);
  }

  async getAllProperties(query: any) {
    let page = query.page;
    let limit = query.limit;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const qb = this.propertyRepo
      .createQueryBuilder('prop')
      .leftJoinAndSelect('prop.landlord', 'landlord')
      .leftJoinAndSelect('prop.building', 'building')
      .leftJoinAndSelect('building.block', 'block')
      .leftJoinAndSelect('prop.tenant', 'tenant')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('prop.created_at', 'DESC');

    if (query.status) {
      qb.andWhere('prop.status = :status', {
        status: query.status,
      });
    }

    if (query.listingStatus) {
      qb.andWhere('prop.listing_status = :listingStatus', {
        listingStatus: query.listingStatus,
      });
    }

    if (query.buildingId) {
      qb.andWhere('prop.building_id = :buildingId', {
        buildingId: query.buildingId,
      });
    }

    if (query.blockId) {
      qb.andWhere('building.block_id = :blockId', {
        blockId: query.blockId,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(prop.unit_number ILIKE :search OR landlord.name ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllBuildings(query: any) {
    let page = query.page;
    let limit = query.limit;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const qb = this.buildingRepo
      .createQueryBuilder('bld')
      .leftJoinAndSelect('bld.block', 'block')
      .leftJoinAndSelect('bld.created_by', 'admin')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('bld.created_at', 'DESC');

    if (query.blockId) {
      qb.andWhere('bld.block_id = :blockId', {
        blockId: query.blockId,
      });
    }

    if (query.search) {
      qb.andWhere('(bld.name ILIKE :search OR block.name ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllBlocks(query: any) {
    let page = query.page;
    let limit = query.limit;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const qb = this.blockRepo
      .createQueryBuilder('blk')
      .leftJoinAndSelect('blk.created_by', 'admin')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('blk.created_at', 'DESC');

    if (query.search) {
      qb.andWhere('(blk.name ILIKE :search OR blk.address ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllTenants(query: any) {
    let page = query.page;
    let limit = query.limit;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const qb = this.tenantRepo
      .createQueryBuilder('tn')
      .leftJoinAndSelect('tn.property', 'property')
      .leftJoinAndSelect('property.landlord', 'landlord')
      .leftJoinAndSelect('tn.approved_by', 'approvedBy')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('tn.created_at', 'DESC');

    if (query.status) {
      qb.andWhere('tn.status = :status', {
        status: query.status,
      });
    }

    if (query.propertyId) {
      qb.andWhere('tn.property_id = :propertyId', {
        propertyId: query.propertyId,
      });
    }

    if (query.search) {
      qb.andWhere('(tn.name ILIKE :search OR tn.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const result = await qb.getManyAndCount();
    const data = result[0];
    const total = result[1];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllAdmins() {
    return await this.adminRepo.find({
      relations: {
        landlords: true,
        staff: true,
        blocks: true,
        buildings: true,
      },
    });
  }

  async getWorkOrderSummaryReport(filterDto: FilterWorkOrderDto) {
    const qb = this.workOrderRepo
      .createQueryBuilder('wo')
      .select('wo.status', 'status')
      .addSelect('COUNT(wo.id)', 'count')
      .addSelect(
        'AVG(wo.labor_cost + wo.materials_cost + wo.additional_cost)',
        'avgCost',
      )
      .addSelect(
        'SUM(wo.labor_cost + wo.materials_cost + wo.additional_cost)',
        'totalCost',
      )
      .groupBy('wo.status');

    if (filterDto.dateFrom) {
      qb.andWhere('wo.created_at >= :dateFrom', {
        dateFrom: filterDto.dateFrom,
      });
    }

    if (filterDto.dateTo) {
      qb.andWhere('wo.created_at <= :dateTo', {
        dateTo: filterDto.dateTo,
      });
    }

    if (filterDto.status) {
      qb.andWhere('wo.status = :status', {
        status: filterDto.status,
      });
    }

    const raw = await qb.getRawMany();
    const report: any[] = [];

    for (const row of raw) {
      let avgCost = 0;
      let totalCost = 0;

      if (row.avgCost) {
        avgCost = parseFloat(row.avgCost);
      }

      if (row.totalCost) {
        totalCost = parseFloat(row.totalCost);
      }

      report.push({
        status: row.status,
        count: parseInt(row.count),
        avgCost,
        totalCost,
      });
    }

    return report;
  }

  async getReviewByOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: {
        review: { tenant: true },
      },
    });

    if (!order) {
      throw new NotFoundException(`Work order ${id} not found`);
    }

    if (!order.review) {
      throw new NotFoundException(`Review for work order ${id} not found`);
    }

    return order.review;
  }

  async deleteReview(id: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepo.delete(id);

    return {
      message: 'Review successfully deleted',
      deletedId: id,
    };
  }

  async getAllLandLoards() {
    return await this.landlordRepo.find({
      relations: {
        properties: true,
        tenants: true,
      },
    });
  }
}
