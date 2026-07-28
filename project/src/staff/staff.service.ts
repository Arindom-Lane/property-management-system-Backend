// staff.service.ts
import {
  Injectable, Inject,
  NotFoundException,
  BadRequestException, ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";

import { Worker, WorkerStatus } from "./entities/worker.entity";
import {
  workOrder,
  orderStatus as WorkOrderStatus,
} from "./entities/work-order.entity";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { DispatchWorkOrderDto } from "./dto/dispatch-work-order.dto";
import { CreateWorkOrderDto, orderStatus } from "./dto/create-work-oder.dto";
import { CompleteWorkOrderDto } from "./dto/complete-work-order.dto";
import { Review } from "./entities/review.entity";
import { LandlordEntity } from "../landlord/entities/landlord.entity";
import { StaffEntity } from "./entities/staff.entity";
import { staffDto } from "./dto/staff.dto";
import * as bcrypt from "bcrypt";
import { MailService } from "../mail/mail.service";


@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    @InjectRepository(workOrder)
    private readonly workOrderRepo: Repository<workOrder>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(LandlordEntity)
    private readonly landLoardRepo: Repository<LandlordEntity>,
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,

    private readonly mailService: MailService,

  ) { }

  async createStaff(data: staffDto): Promise<StaffEntity> {

    const IsStaff = await this.staffRepo.findOne({
      where: {
        email: data.email,
        phone_number: data.phone_number
      },
    })
    if (IsStaff) {
      throw new ForbiddenException("Your account exists. YOu are not allowed");
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      data.password,
      saltRounds,
    );


    const staff = this.staffRepo.create({ ...data, password: hashedPassword });

    await this.mailService.sendWelcomeMail(
      data.email,
      data.name,
    );

    await this.staffRepo.save(staff);



    return staff;
  }

  async findStaff(id: number){
    return await this.staffRepo.findOne({
      where: {id: id}
    });

  }

  async viewAllStaff() {
    return await this.staffRepo.find();
  }

  async loginStaff(dto: staffDto) {
    const staff = await this.staffRepo.findOne({
      where: { email: dto.email }
    })
    if (!staff) throw new NotFoundException("Email not found");

    const isPasswordCorrect = await bcrypt.compare(
      dto.password,
      staff.password,
    );

    if (!isPasswordCorrect) throw new UnauthorizedException("Invalid passowrd")

    return staff;
  }

  async createWorker(data: CreateWorkerDto): Promise<Worker> {
    const newWorker = this.workerRepository.create(data);
    return await this.workerRepository.save(newWorker);
  }

  async findAllWorkers() {
    return await this.workerRepository.find();
  }

  async updateWorkerName(id: number, updateWorkerDto: CreateWorkerDto) {
    await this.workerRepository.update(id, updateWorkerDto);
    return await this.workerRepository.findOne({ where: { id } });
  }

  async deleteWorker(id: number) {
    const worker = await this.workerRepository.findOne({ where: { id } });
    if (!worker) {
      throw new NotFoundException("Worker not found");
    }

    await this.workerRepository.delete(id);
    return { message: `${worker.name} has been deleted` };
  }

  async findAllWorkOrders(): Promise<workOrder[]> {
    return await this.workOrderRepo.find({
      relations: {
        worker: true,
        review: true,
        landlord: true,
        transactions: true,
      },
    });
  }

  async createWorkOrder(dto: CreateWorkOrderDto) {
    const order = this.workOrderRepo.create(dto);
    const saved = await this.workOrderRepo.save(order);
    return saved;
  }

  async dispatchWorker(workOrderId: number, dto: DispatchWorkOrderDto) {
    const order = await this.workOrderRepo.findOne({
      where: { id: workOrderId },
      relations: { worker: true },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.workStatus === WorkOrderStatus.done) {
      throw new BadRequestException("The order is already complete.");
    } else if (order.worker) {
      throw new BadRequestException("The order already has a worker.");
    }

    const worker = await this.workerRepository.findOne({
      where: { id: dto.workerId },
    });

    if (!worker) {
      throw new NotFoundException("Worker not found");
    }

    order.worker = worker;
    order.workStatus = WorkOrderStatus.active;
    worker.status = WorkerStatus.busy;

    await this.workerRepository.save(worker);
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

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!order.worker) {
      return order;
    }
    const workerId = order.worker.id;
    const otherActiveCount = await this.workOrderRepo.count({
      where: {
        worker: { id: workerId },
        workStatus: Not(WorkOrderStatus.done),
        id: Not(id),
      },
    });

    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
    });
    if (worker) {
      if (otherActiveCount === 0) {
        worker.status = WorkerStatus.active;
      } else {
        worker.status = WorkerStatus.busy;
      }
      await this.workerRepository.save(worker);
    }

    order.worker = null;
    order.workStatus = WorkOrderStatus.pending;
    await this.workOrderRepo.save(order);

    return order;
  }

  async completeWorkOrder(id: number, dto: CompleteWorkOrderDto) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { worker: true },
    });

    if (!order) {
      throw new NotFoundException("Work order not found");
    }

    order.labor_cost += dto.labor_cost;
    order.materials_cost += dto.materials_cost;
    order.workStatus = WorkOrderStatus.done;

    if (order.worker) {
      const worker = await this.workerRepository.findOne({
        where: { id: order.worker.id },
        relations: { workOrders: true },
      });

      if (worker) {
        const otherActiveCount = await this.workOrderRepo.count({
          where: {
            worker: { id: worker.id },
            workStatus: Not(WorkOrderStatus.done),
            id: Not(id),
          },
        });

        if (otherActiveCount === 0) {
          worker.status = WorkerStatus.active;
          await this.workerRepository.save(worker);
        } else {
          worker.status = WorkerStatus.busy;
          await this.workerRepository.save(worker);
        }
      }
    }

    return this.workOrderRepo.save(order);
  }

  async deleteOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id },
      relations: { worker: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (order.worker) {
      const workerId = order.worker.id;

      const otherActiveCount = await this.workOrderRepo.count({
        where: {
          worker: { id: workerId },
          workStatus: Not(WorkOrderStatus.done),
          id: Not(id),
        },
      });

      const worker = await this.workerRepository.findOne({
        where: { id: workerId },
      });
      if (worker) {
        if (otherActiveCount === 0) {
          worker.status = WorkerStatus.active;
        } else {
          worker.status = WorkerStatus.busy;
        }
        await this.workerRepository.save(worker);
      }
    }

    await this.workOrderRepo.delete(id);

    return { message: `Order ${id} has been deleted` };
  }

  async getAllLandLoards() {
    return await this.landLoardRepo.find();
  }


  async getReviewByOrder(id: number) {
    const order = await this.workOrderRepo.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException(`Work order ${id} not found`);
    }

    if (!order.review) {
      throw new NotFoundException(`Review for work order ${id} not found`);
    }
    const review = await this.reviewRepo.findOne({
      where: { id: order?.review?.id },
      relations: { workOrder: true },
    });
    return review;
  }
}
