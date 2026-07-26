// staff.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Worker, WorkerStatus } from "./entities/worker.entity";
import {
  workOrder,
  orderStatus as WorkOrderStatus,
} from "./entities/work-order.entity";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { DispatchWorkOrderDto } from "./dto/dispatch-work-order.dto";
import { CreateWorkOrderDto, orderStatus } from "./dto/create-work-oder.dto";
import { CompleteWorkOrderDto } from "./dto/complete-work-order.dto";

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    @InjectRepository(workOrder)
    private readonly workOrderRepo: Repository<workOrder>,
  ) {}

  async createWorker(data: CreateWorkerDto): Promise<Worker> {
    const newWorker = this.workerRepository.create(data);
    return await this.workerRepository.save(newWorker);
  }

  async findAllWorkers() {
    return await this.workerRepository.find();
  }

  async updateWorkerName(id: number, updateWorkerDto: UpdateWorkerDto) {
    await this.workerRepository.update(id, updateWorkerDto);
    return await this.workerRepository.findOne({ where: { id } });
  }

  async deleteWorker(id: number) {
    const worker = await this.workerRepository.findOne({ where: { id } });
    if (!worker) {
      throw new NotFoundException("Worker not found");
    }

    await this.workerRepository.delete(id);
    return `${worker.name} has been deleted`;
  }

  async findAllWorkOrders(): Promise<workOrder[]> {
    return await this.workOrderRepo.find({ relations: { worker: true } });
  }

  async createWorkOrder(dto: CreateWorkOrderDto) {
    const worker = await this.workerRepository.findOne({
      where: { id: dto.workerId },
    });

    if (!worker) {
      throw new NotFoundException("Worker not found");
    }

    const existingOrder = await this.workOrderRepo.findOne({
      where: { worker: { id: dto.workerId } },
      relations: { worker: true },
    });

    if (existingOrder) {
      throw new BadRequestException("Worker already has an order, busy");
    }

    const order = this.workOrderRepo.create({
      workStatus: dto.workStatus ?? WorkOrderStatus.inactive,
      labor_cost: dto.labor_cost,
      materials_cost: dto.materials_cost,
      worker: worker,
    });

    worker.status = WorkerStatus.busy;
    await this.workerRepository.save(worker);

    return this.workOrderRepo.save(order);
  }

  async dispatchWorker(workOrderId: number, dto: DispatchWorkOrderDto) {
  const order = await this.workOrderRepo.findOne({
    where: { id: workOrderId },
    relations: { worker: true },
  });

  if (!order) {
    return 'Order not found';
  }

  

  const worker = await this.workerRepository.findOne({
    where: { id: dto.workerId },
  });

  if (!worker) {
    return 'Worker not found';
  }
  if(order.worker?.id != dto.workerId ){
    return `worker ${worker.name} is not assigned to this job, remove and retry`
  }

  

  order.workStatus = WorkOrderStatus.active; 

  worker.status = WorkerStatus.busy;

  await this.workerRepository.save(worker);
  await this.workOrderRepo.save(order);

  return await this.workOrderRepo.findOne({
    where: { id: workOrderId },
    relations: { worker: true },
  });
}

async removeWorkerFromOrder(id: number){
  const order = await this.workOrderRepo.findOne({
    where: {id: id}
  })
  if(!order){
    return "Order not found";
  }

  if (order.worker) {
    const worker = await this.workerRepository.findOne({
      where: { id: order.worker.id },
    });

    if (worker) {
      worker.status = WorkerStatus.active;
      await this.workerRepository.save(worker);
    }
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

    order.labor_cost = dto.labor_cost;
    order.materials_cost = dto.materials_cost;
    order.workStatus = WorkOrderStatus.done;

    if (order.worker) {
      const worker = await this.workerRepository.findOne({
        where: { id: order.worker.id },
      });

      if (worker) {
        worker.status = WorkerStatus.active;
        await this.workerRepository.save(worker);
      }
    }

    return this.workOrderRepo.save(order);
  }
}
