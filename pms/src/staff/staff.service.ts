import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { staffDto } from './dto/staff.dto';
import { WorkerEntity, WorkerStatus } from './entities/worker.entity';
import { WorkOrder, OrderStatus } from './entities/work_order.entity';
import { ReviewEntity } from './entities/review.entity';
import { StaffEntity } from './entities/staff.entity';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { CreateWorkOrderDto } from './dto/CreateWorkOrder.dto';
import { IssueEntity } from 'src/tenant/entities/issue.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { TenantEntity, TenantStatus } from 'src/tenant/entities/tenant.entity';
import { DispatchWorkerDto } from './dto/DispatchWorkOrder.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { CompleteWorkOrderDto } from './dto/CompleteWorkOrder.dto';

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
    private readonly ladnlordRepo: Repository<LandlordEntity>,
    @InjectRepository(TenantEntity)
    private readonly tanentRepo: Repository<TenantEntity>,
  ) {}

  async findAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found!');
    return admin;
  }

  async findWOrkOrder(id: number) {
    const workOrder = await this.workOrderRepo.findOne({
      where: { id },
      relations: {
        worker: true,
        review: true,
        property: true,
        landlord: true,
        tenant: true,
        staff: true,
        issue: true,
      },
    });
    if (!workOrder) throw new NotFoundException('WorkOrder not found!');
    return workOrder;
  }

  async findStaff(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Staff not found!');
    return staff;
  }

  async findIssue(id: number) {
    const issue = await this.issueRepo.findOne({ where: { id } });
    if (!issue) throw new NotFoundException('Issue not found!');
    return issue;
  }

  async findProperty(id: number) {
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: { landlord: true },
    });
    if (!property) throw new NotFoundException('Property not found!');
    return property;
  }

  async findLandlord(id: number) {
    const landlord = await this.ladnlordRepo.findOne({ where: { id } });
    if (!landlord) throw new NotFoundException('Landlord not found!');
    return landlord;
  }

  async findTanent(id: number) {
    const tenant = await this.tanentRepo.findOne({
      where: { id },
      relations: { property: true, approved_by: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found!');
    return tenant;
  }

  async findWorker(id: number) {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found!');
    return worker;
  }

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

  async deleteReview(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.reviewRepo.delete(id);
    return {
      message: 'Review successfully deleted',
      deletedId: id,
    };
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

  async findAllWorkOrders() {
    return await this.workOrderRepo.find({
      relations: {
        worker: true,
        review: true,
        landlord: true,
        tenant: true,
        property: true,
        staff: true,
        issue: true,
      },
    });
  }

  async createWorkOrder(staffId: number, body: CreateWorkOrderDto) {
    const staff = await this.findStaff(staffId);
    const issue = await this.findIssue(body.issue_id);
    const property = await this.findProperty(body.property_id);
    const landlord = await this.findLandlord(body.landlord_id);

    // property must belong to landlord
    if (!property.landlord || property.landlord.id !== landlord.id) {
      throw new BadRequestException('Property does not belong to landlord');
    }

    let tenant: TenantEntity | null = null;
    if (body.tenant_id) {
      tenant = await this.findTanent(body.tenant_id);

      if (!tenant.property || tenant.property.id !== property.id) {
        throw new BadRequestException(
          'Tenant is not associated with the property',
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

    const workOrder = this.workOrderRepo.create({
      issue,
      property,
      landlord,
      tenant: tenant ?? null,
      staff,
      created_by_type: 'staff',
      created_by_id: staff.id,
      status: OrderStatus.PENDING,
      labor_cost: 0,
      materials_cost: 0,
      additional_cost: 0,
    });

    return await this.workOrderRepo.save(workOrder);
  }

  async loginStaff(dto: staffDto) {
    const staff = await this.staffRepo.findOne({ where: { email: dto.email } });
    if (!staff) throw new NotFoundException('Email not found');
    const isPasswordCorrect = await bcrypt.compare(
      dto.password_hash,
      staff.password_hash,
    );
    if (!isPasswordCorrect) throw new UnauthorizedException('Invalid password');
    return staff;
  }

  async createWorker(
    staffId: number,
    data: CreateWorkerDto,
  ): Promise<WorkerEntity> {
    const staff = await this.findStaff(staffId);
    const exists = await this.workerRepo.findOne({
      where: { email: data.email },
    });
    if (exists) throw new BadRequestException('Worker email already exists');

    const newWorker = this.workerRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      worker_area: data.worker_area,
      status: data.status ?? WorkerStatus.FREE,
      created_by: staff,
    });

    await this.workerRepo.save(newWorker);
    return newWorker;
  }

  async findStaffByEmail(email: string) {
    return await this.staffRepo.findOne({ where: { email } });
  }

  async findAllWorkers() {
    return await this.workerRepo.find({ relations: { created_by: true } });
  }

  async updateWorkerName(id: number, updateWorkerDto: CreateWorkerDto) {
    const { created_by, ...updateData } = updateWorkerDto as any;
    await this.workerRepo.update(id, updateData);
    return await this.workerRepo.findOne({ where: { id } });
  }

  async deleteWorker(id: number) {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    await this.workerRepo.delete(id);
    return { message: `${worker.name} has been deleted` };
  }

  async dispatchWorker(workOrderId: number, dto: DispatchWorkerDto) {
    const order = await this.findWOrkOrder(workOrderId);
    const worker = await this.findWorker(dto.worker_id);

    if (
      order.status === OrderStatus.COMPLETE ||
      order.status === OrderStatus.TENANT_CONFIRMED
    ) {
      throw new BadRequestException('The order is already complete.');
    }
    if (order.status === OrderStatus.ASSIGNED || order.worker) {
      throw new BadRequestException('The order already has a worker.');
    }
    if (worker.status !== WorkerStatus.FREE) {
      throw new BadRequestException('Worker is not available for dispatch');
    }

    order.worker = worker;
    order.status = OrderStatus.ASSIGNED;
    worker.status = WorkerStatus.BUSY;

    await this.workerRepo.save(worker);
    await this.workOrderRepo.save(order);

    return await this.workOrderRepo.findOne({
      where: { id: workOrderId },
      relations: { worker: true },
    });
  }

  async removeWorkerFromOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { worker: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (!order.worker)
      throw new BadRequestException('No worker is assigned to this work order');

    const workerId = order.worker.id;
    const otherActiveCount = await this.workOrderRepo.count({
      where: {
        worker: { id: workerId },
        status: Not(OrderStatus.COMPLETE),
        id: Not(id),
      },
    });

    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
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
      relations: { worker: true },
    });

    if (!order) throw new NotFoundException('Work order not found');

    order.labor_cost += dto.labor_cost || 0;
    order.materials_cost += dto.materials_cost || 0;
    order.additional_cost += dto.additional_cost || 0;

    order.status = OrderStatus.COMPLETE;
    order.completed_at = new Date();

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

    return await this.workOrderRepo.save(order);
  }

  async deleteOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { worker: true },
    });

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    if (order.worker) {
      const workerId = order.worker.id;
      const otherActiveCount = await this.workOrderRepo.count({
        where: {
          worker: { id: workerId },
          status: Not(OrderStatus.COMPLETE),
          id: Not(id),
        },
      });

      const worker = await this.workerRepo.findOne({ where: { id: workerId } });
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
    return { message: `Order ${id} has been deleted` };
  }

  async getAllLandLoards() {
    return await this.ladnlordRepo.find({
      relations:{
        properties: true,
      }
    });
  }

  async getReviewByOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { review: true },
    });
    if (!order) throw new NotFoundException(`Work order ${id} not found`);
    if (!order.review)
      throw new NotFoundException(`Review for work order ${id} not found`);
    return order.review;
  }
}
