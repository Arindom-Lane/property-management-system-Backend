import {
  Injectable, Inject,
  NotFoundException,
  BadRequestException, ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { staffDto } from "./dto/staff.dto";
import { WorkerEntity } from "./entities/worker.entity";
import { WorkOrder } from "./entities/work_order.entity";
import { ReviewEntity } from "./entities/review.entity";
import { StaffEntity } from "./entities/staff.entity";
import * as bcrypt from "bcrypt";
import { AdminEntity } from "src/admin/entities/admin.entity";
import { CreateWorkOrderDto } from "./dto/CreateWorkOrder.dto";
import { IssueEntity } from "src/tenant/entities/issue.entity";
import { PropertyEntity } from "src/landlord/entities/property.entity";
import { LandlordEntity } from "src/landlord/entities/landlord.entity";
import { TenantEntity } from "src/tenant/entities/tenant.entity";
import {OrderStatus} from "./entities/work_order.entity"
import { WorkerStatus } from './entities/worker.entity'
import {DispatchWorkerDto} from './dto/DispatchWorkOrder.dto'
import {CreateWorkerDto}from './dto/CreateWorker.dto'
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
    

    //private readonly mailService: MailService,

  ) { }

  async findAdmin(id:number){
    const admin = await this.adminRepo.findOne({
      where:{id: id}
    })

    if (!admin) throw new NotFoundException("Admin not found!");
    return admin;
  }
  async findWOrkOrder(id:number){
    const workOrder = await this.workOrderRepo.findOne({
      where:{id: id}
    })

    if (!workOrder) throw new NotFoundException("workOrder not found!");
    return workOrder;
  }
  async findStaff(id:number){
    const staff = await this.staffRepo.findOne({
      where:{id: id}
    })

    if (!staff) throw new NotFoundException("staff not found!");
    return staff;
  }
  async findIssue(id:number){
    const issue = await this.issueRepo.findOne({
      where:{id: id}
    })

    if (!issue) throw new NotFoundException("issue not found!");
    return issue;
  }
  async findProperty(id:number){
    const property = await this.propertyRepo.findOne({
      where:{id: id}
    })

    if (!property) throw new NotFoundException("property not found!");
    return property;
  }
  async findLandlord(id:number){
    const landlord = await this.ladnlordRepo.findOne({
      where:{id: id}
    })

    if (!landlord) throw new NotFoundException("landlord not found!");
    return landlord;
  }
  async findTanent(id:number){
    const tanent = await this.tanentRepo.findOne({
      where:{id: id}
    })

    if (!tanent) throw new NotFoundException("tanent not found!");
    return tanent;
  }
  async findWorker(id:number){
    const worker = await this.workerRepo.findOne({
      where:{id: id}
    })

    if (!worker) throw new NotFoundException("worker not found!");
    return worker;
  }


  async createStaff(data: staffDto): Promise<StaffEntity> {

    const IsStaff = await this.staffRepo.findOne({
      where: {
        email: data.email,
        phone: data.phone
      },
    })
    if (IsStaff) {
      throw new ForbiddenException("Your account exists. YOu are not allowed");
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      data.password_hash,
      saltRounds,
    );

    
    const admin = await this.findAdmin(data.created_by);

    const staff = await this.staffRepo.create({ ...data, password_hash: hashedPassword, created_by: admin});

    // await this.mailService.sendWelcomeMail(
    //   data.email,
    //   data.name,
    // );

    await this.staffRepo.save(staff);



    return staff;
  }

//   async findStaff(id: number) {
//     return await this.staffRepo.findOne({
//       where: { id: id }
//     });

//   }

//   async deleteReview(id: number){
//     const review = await this.reviewRepo.findOne({
//       where:{id: id}
//     })

//     if(!review) throw new NotFoundException("Review not found");

//     await this.reviewRepo.delete(id);

//     return `${review.id} has been deleted`;
//   }

  async viewAllStaff() {
    return await this.staffRepo.find({
      relations: {created_by: true}
    });
  }

  async deleteStaff(id: number){
    const staff = await this.staffRepo.findOne({
      where: {id: id}
    })
    if(!staff) throw new NotFoundException("Staff not found");

    return await this.staffRepo.delete(staff.id);

  }

  async findAllWorkOrders(){
    return await this.workOrderRepo.find();
  }

  async createWorkOrder(id: number, body: CreateWorkOrderDto) {
  const staff = await this.findStaff(id);
  const issue = await this.findIssue(body.issue_id);
  const property = await this.findProperty(body.property_id);
  const landlord = await this.findLandlord(body.landlord_id);
  const tanent = await this.findTanent(body.tenant_id);


  const workOrder = this.workOrderRepo.create({
    issue: issue,
    property: property,
    landlord: landlord,
    tenant: tanent,
    staff: staff,
    created_by_type: "staff",
    created_by_id: staff.id,
    status: OrderStatus.PENDING
  });


  return await this.workOrderRepo.save(workOrder);
}

//   async loginStaff(dto: staffDto) {
//     const staff = await this.staffRepo.findOne({
//       where: { email: dto.email }
//     })
//     if (!staff) throw new NotFoundException("Email not found");

//     const isPasswordCorrect = await bcrypt.compare(
//       dto.password,
//       staff.password,
//     );

//     if (!isPasswordCorrect) throw new UnauthorizedException("Invalid passowrd")

//     return staff;
//   }

  async createWorker(
  staffId: number,
  data: CreateWorkerDto
): Promise<WorkerEntity> {

  const staff = await this.findStaff(staffId);

  const newWorker = this.workerRepo.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    worker_area: data.worker_area,
    status: WorkerStatus.FREE,
    created_by: staff,
  });


  await this.workerRepo.save(newWorker);


  const worker = await this.workerRepo.findOne({
    where: {
      email: data.email,
    },
  });


  if (!worker) {
    throw new NotFoundException("Worker not found after creation");
  }


  return worker;
}

//   async findAllWorkers() {
//     return await this.workerRepository.find();
//   }

//   async updateWorkerName(id: number, updateWorkerDto: CreateWorkerDto) {
//     await this.workerRepository.update(id, updateWorkerDto);
//     return await this.workerRepository.findOne({ where: { id } });
//   }

//   async deleteWorker(id: number) {
//     const worker = await this.workerRepository.findOne({ where: { id } });
//     if (!worker) {
//       throw new NotFoundException("Worker not found");
//     }

//     await this.workerRepository.delete(id);
//     return { message: `${worker.name} has been deleted` };
//   }

//   async findAllWorkOrders(): Promise<workOrder[]> {
//     return await this.workOrderRepo.find({
//       relations: {
//         worker: true,
//         review: true,
//         landlord: true,
//         transactions: true,
//         property: true,
//       },
//     });
//   }


  async dispatchWorker(workOrderId: number, dto: DispatchWorkerDto) {
    const order = await this.findWOrkOrder(workOrderId); 
    const worker = await this.findWorker(dto.worker_id)

    if (order.status === OrderStatus.COMPLETE || order.status === OrderStatus.TENANT_CONFIRMED) {
      throw new BadRequestException("The order is already complete.");
    } else if(order.status === OrderStatus.ASSIGNED){
      throw new BadRequestException("The order already has a worker");
    }else if (order.worker) {
      throw new BadRequestException("The order already has a worker.");
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

//   async removeWorkerFromOrder(id: number) {
//     const order = await this.workOrderRepo.findOne({
//       where: { id },
//       relations: { worker: true },
//     });

//     if (!order) {
//       throw new NotFoundException("Order not found");
//     }

//     if (!order.worker) {
//       throw new BadRequestException(
//         "No worker is assigned to this work order",
//       );
//     }
//     const workerId = order.worker.id;
//     const otherActiveCount = await this.workOrderRepo.count({
//       where: {
//         worker: { id: workerId },
//         workStatus: Not(WorkOrderStatus.done),
//         id: Not(id),
//       },
//     });

//     const worker = await this.workerRepository.findOne({
//       where: { id: workerId },
//     });
//     if (worker) {
//       if (otherActiveCount === 0) {
//         worker.status = WorkerStatus.active;
//       } else {
//         worker.status = WorkerStatus.busy;
//       }
//       await this.workerRepository.save(worker);
//     }

//     order.worker = null;
//     order.workStatus = WorkOrderStatus.pending;
//     await this.workOrderRepo.save(order);

//     return order;
//   }

//   async completeWorkOrder(id: number, dto: CompleteWorkOrderDto) {
//     const order = await this.workOrderRepo.findOne({
//       where: { id },
//       relations: { worker: true },
//     });

//     if (!order) {
//       throw new NotFoundException("Work order not found");
//     }

//     order.labor_cost += dto.labor_cost;
//     order.materials_cost += dto.materials_cost;
//     order.workStatus = WorkOrderStatus.done;

//     if (order.worker) {
//       const worker = await this.workerRepository.findOne({
//         where: { id: order.worker.id },
//         relations: { workOrders: true },
//       });

//       if (worker) {
//         const otherActiveCount = await this.workOrderRepo.count({
//           where: {
//             worker: { id: worker.id },
//             workStatus: Not(WorkOrderStatus.done),
//             id: Not(id),
//           },
//         });

//         if (otherActiveCount === 0) {
//           worker.status = WorkerStatus.active;
//           await this.workerRepository.save(worker);
//         } else {
//           worker.status = WorkerStatus.busy;
//           await this.workerRepository.save(worker);
//         }
//       }
//     }

//     return this.workOrderRepo.save(order);
//   }

//   async deleteOrder(id: number) {
//     const order = await this.workOrderRepo.findOne({
//       where: { id },
//       relations: { worker: true },
//     });

//     if (!order) {
//       throw new NotFoundException(`Order with id ${id} not found`);
//     }

//     if (order.worker) {
//       const workerId = order.worker.id;

//       const otherActiveCount = await this.workOrderRepo.count({
//         where: {
//           worker: { id: workerId },
//           workStatus: Not(WorkOrderStatus.done),
//           id: Not(id),
//         },
//       });

//       const worker = await this.workerRepository.findOne({
//         where: { id: workerId },
//       });
//       if (worker) {
//         if (otherActiveCount === 0) {
//           worker.status = WorkerStatus.active;
//         } else {
//           worker.status = WorkerStatus.busy;
//         }
//         await this.workerRepository.save(worker);
//       }
//     }

//     await this.workOrderRepo.delete(id);

//     return { message: `Order ${id} has been deleted` };
//   }

//   async getAllLandLoards() {
//     return await this.landLoardRepo.find();
//   }


//   async getReviewByOrder(id: number) {
//     const order = await this.workOrderRepo.findOne({
//       where: { id: id },
//     });
//     if (!order) {
//       throw new NotFoundException(`Work order ${id} not found`);
//     }

//     if (!order.review) {
//       throw new NotFoundException(`Review for work order ${id} not found`);
//     }
//     const review = await this.reviewRepo.findOne({
//       where: { id: order?.review?.id },
//       relations: { workOrder: true },
//     });
//     return review;
//   }

}
