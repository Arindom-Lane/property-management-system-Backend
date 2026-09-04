import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { TenantEntity } from './entities/tenant.entity';
import { IssueEntity } from './entities/issue.entity';

import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { LoginTenantDto } from './dto/login-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

import { WorkOrder, OrderStatus } from 'src/staff/entities/work_order.entity';

import {
  TransactionEntity,
  Transaction_type,
  payer_type,
  status,
  created_by_type,
} from 'src/landlord/entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';


import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { BillStatus, TenantBillEntity } from 'src/landlord/entities/tenant-bill.entity';
@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,

    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,

    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,

    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,

    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    @InjectRepository(TenantBillEntity)
private readonly tenantBillRepository:
  Repository<TenantBillEntity>,

  @InjectRepository(WorkOrder)
private readonly workOrderRepository: Repository<WorkOrder>,



    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  
  // Register Tenant
 
async createTenant(
  dto: CreateTenantDto,
): Promise<TenantEntity> {
    const existingTenant = await this.tenantRepository.findOne({
      where: [
        { email: dto.email },
        { phone: dto.phone },
        { nid_number: dto.nid_number },
      ],
    });

    if (existingTenant) {
      throw new BadRequestException(
        'Tenant already exists.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const tenant = this.tenantRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password_hash: hashedPassword,
      nid_number: dto.nid_number,
      nid_document_url: dto.nid_document_url,
      has_vehicle: dto.has_vehicle ?? false,
    });

    // return await this.tenantRepository.save(tenant);

  // Save tenant
  const savedTenant = await this.tenantRepository.save(tenant);

  // Send welcome mail
  await this.mailService.sendWelcomeMail(
    savedTenant.email,
    savedTenant.name,
  );

  // Return response
  return savedTenant;
}
  // const raj= await this.tenantRepository.save(tenant);
  // return{
  //   message: 'Tenant created successfully',
  //   email: raj.email,
  //   phone: raj.phone,
  //   nid_number: raj.nid_number,   
  // }
  
  


  // Login
  

async loginTenant(
  dto: LoginTenantDto,
): Promise<any> {
    const tenant = await this.tenantRepository.findOne({
      where: {
        email: dto.email,
          // phone: dto.phone,
      },
    });

    if (!tenant) {
      throw new NotFoundException(
        'Tenant not found.',
      );
    }

    const isMatched = await bcrypt.compare(
      dto.password,
      tenant.password_hash,
    );

    if (!isMatched) {
      throw new ForbiddenException(
        'Incorrect password.',
      );
    }

    const payload = {
  id: tenant.id,
  email: tenant.email,
};

return {
  message: 'Login Successful',
  access_token: this.jwtService.sign(payload),
  tenant,
};
  }

  
  // Get All Tenants

  async getAllTenants(): Promise<TenantEntity[]> {
    return await this.tenantRepository.find();
  }

  // Get Tenant By ID
  

  async getTenantById(
    id: number,
  ): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findOne({
      where: {
        id,
      },
    });

    if (!tenant) {
      throw new NotFoundException(
        'Tenant not found.',
      );
    }

    return tenant;
  }
  
// Update Tenant

async updateTenant(
  id: number,
  updateData: UpdateTenantDto,
): Promise<TenantEntity> {
  const tenant = await this.tenantRepository.findOne({
    where: { id },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  // Email Duplicate Check
  if (updateData.email && updateData.email !== tenant.email) {
    const existingEmail = await this.tenantRepository.findOne({
      where: { email: updateData.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists.');
    }
  }

  // Password Hash
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);

    tenant.password_hash = updateData.password;

    delete updateData.password;
  }

  Object.assign(tenant, updateData);

  return await this.tenantRepository.save(tenant);
}

// ============================
// Delete Tenant
// ============================

async deleteTenant(
  id: number,
): Promise<{ message: string }> {

  const tenant = await this.tenantRepository.findOne({
    where: { id },
  });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }

  await this.tenantRepository.delete(id);

  return {
    message: 'Tenant deleted successfully.',
  };
}

async deleteTenantByEmail(
  email: string,
): Promise<{ message: string }> {

  const tenant = await this.tenantRepository.findOne({
    where: { email },
  });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }

  await this.tenantRepository.delete({
    email,
  });

  return {
    message: 'Tenant deleted successfully.',
  };
}

//Assigned Property for bad request exception


async getAssignedProperty(id: number): Promise<PropertyEntity> {
  const tenant = await this.tenantRepository.findOne({
    where: { id },
    relations: {
      property: true,
    },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  if (!tenant.property) {
    throw new BadRequestException(
      'No property assigned yet.',
    );
  }

  return tenant.property;
}
async createIssue(
  tenantId: number,
  dto: CreateIssueDto,
): Promise<IssueEntity> {

  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
    relations: {
      property: true,
    },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  if (!tenant.property) {
    throw new BadRequestException(
      'Property is not assigned yet.',
    );
  }

  const issue = this.issueRepository.create({
    description: dto.description,
    image_url: dto.image_url,
    tenant,
    property: tenant.property,
  });

  return await this.issueRepository.save(issue);
}

// //Dummy async getAssignedProperty
// async getAssignedProperty(
//   id: number,
// ): Promise<any> {

//   const tenant = await this.tenantRepository.findOne({
//     where: { id },
//   });

//   if (!tenant) {
//     throw new NotFoundException(
//       'Tenant not found.',
//     );
//   }

//   return {
//     id: 1,
//     unit_number: 'A-101',
//     rent_amount: 15000,
//     listing_status: 'for_rent',
//     status: 'occupied',
//     landlord: 'Demo Landlord',
//   };
// }
// //create issue
// async createIssue(
//   tenantId: number,
//   dto: CreateIssueDto,
// ): Promise<any> {
//   const tenant = await this.tenantRepository.findOne({
//     where: { id: tenantId },
//     relations: {
//       property: true,
//     },
//   });

//   if (!tenant) {
//     throw new NotFoundException('Tenant not found.');
//   }

// //   if (!tenant.property) {
// //     throw new BadRequestException(
// //       'Property is not assigned yet.',
// //     );
// //   }
// //   const issue = this.issueRepository.create({
// //   description: dto.description,
// //   image_url: dto.image_url,
// //   tenant,
// // });

//   const issue = this.issueRepository.create({
//   description: dto.description,
//   image_url: dto.image_url,
//   tenant,
//   property: tenant.property ?? null,
// });

//   return await this.issueRepository.save(issue);
// }

//from that to real code
// get all issues of a tenant
async getTenantIssues(
  tenantId: number,
// ): Promise<IssueEntity[]> {
): Promise<any[]> {
  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  // return await this.issueRepository.find({
  //   where: {
  //     tenant: {
  //       id: tenantId,
  //     },
  //   },
  // });
  const issues = await this.issueRepository.find({
  where: {
    tenant: {
      id: tenantId,
    },
  },
});

return issues.map((issue) => ({
  id: issue.id,
  tenant: {
    id: issue.tenant.id,
    name: issue.tenant.name,
    phone: issue.tenant.phone,
  },
  description: issue.description,
  image_url: issue.image_url,
  status: issue.status,
  created_at: issue.created_at,
}));
}
//get issue by id
async getIssueById(
  issueId: number,
): Promise<any> {
  const issue = await this.issueRepository.findOne({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    throw new NotFoundException(
      'Issue not found.',
    );
  }

  // return issue;
  return {
  id: issue.id,
  tenant: {
    id: issue.tenant.id,
    name: issue.tenant.name,
    phone: issue.tenant.phone,
  },
  description: issue.description,
  image_url: issue.image_url,
  status: issue.status,
  created_at: issue.created_at,
};
}
//update issue
async updateIssue(
  issueId: number,
  dto: UpdateIssueDto,
): Promise<any> {
  const issue = await this.issueRepository.findOne({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    throw new NotFoundException(
      'Issue not found.',
    );
  }

  Object.assign(issue, dto);

  return await this.issueRepository.save(issue);
}
//delete issue
async deleteIssue(
  issueId: number,
): Promise<void> {
  const issue = await this.issueRepository.findOne({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    throw new NotFoundException(
      'Issue not found.',
    );
  }

  await this.issueRepository.delete(issueId);
}
async payRent(
  tenantId: number,
  dto: CreateTransactionDto,
): Promise<TransactionEntity> {

  // Tenant find
  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
    relations: {
  property: {
    landlord: true,
  },
},
  });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }


  // Property assigned
  if (!tenant.property) {
    throw new BadRequestException(
      'Property is not assigned yet.',
    );
  }


  // 
  if (dto.type !== Transaction_type.rent) {
    throw new BadRequestException(
      'Invalid transaction type.',
    );
  }

//pay-rent
  
  const amount = tenant.property.rent_amount;


  
  const transaction =
    this.transactionRepository.create({
      type: Transaction_type.rent,

      amount: amount,

      tenant_id: tenant,

      property_id: tenant.property,

      landlord: tenant.property.landlord,

      payer_type: payer_type.tenant,

      status: status.pending,

      created_by_type: created_by_type.tenant,
    });


  
  return await this.transactionRepository.save(
    transaction,
  );
}

//make payment for service charge
async makePayment(
  tenantId: number,
  dto: CreateTransactionDto,
): Promise<TransactionEntity> {

  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
    relations: {
      property: {
        landlord: true,
      },
    },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  if (!tenant.property) {
    throw new BadRequestException(
      'Property is not assigned yet.',
    );
  }

  let amount: number;

  switch (dto.type) {

    case Transaction_type.rent:
      amount = Number(tenant.property.rent_amount);
      break;

    case Transaction_type.service_charge:
      if (tenant.property.service_charge == null) {
        throw new BadRequestException(
          'Service charge is not available.',
        );
      }

      amount = Number(
        tenant.property.service_charge,
      );
      break;

    case Transaction_type.parking:
      if (
        !tenant.property.has_parking ||
        tenant.property.parking_fee == null
      ) {
        throw new BadRequestException(
          'Parking is not available.',
        );
      }

      amount = Number(
        tenant.property.parking_fee,
      );
      break;

    case Transaction_type.electricity:
    case Transaction_type.water:
    case Transaction_type.gas:
    case Transaction_type.work_order_cost:

      if (
        dto.amount === undefined ||
        dto.amount <= 0
      ) {
        throw new BadRequestException(
          'Amount is required.',
        );
      }

      amount = dto.amount;
      break;

    default:
      throw new BadRequestException(
        'Invalid transaction type.',
      );
  }

  const transaction =
    this.transactionRepository.create({
      type: dto.type,
      amount,
      tenant_id: tenant,
      property_id: tenant.property,
      landlord: tenant.property.landlord,
      payer_type: payer_type.tenant,
      status: status.pending,
      created_by_type: created_by_type.tenant,
    });

  return await this.transactionRepository.save(
    transaction,
  );
}
// get due bills for a tenant
async getDueBills(
  tenantId: number,
): Promise<TenantBillEntity[]> {

  const tenant =
    await this.tenantRepository.findOne({
      where: {
        id: tenantId,
      },
    });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }

  return await this.tenantBillRepository.find({
    where: {
      tenant: {
        id: tenantId,
      },
      status: BillStatus.unpaid,
    },
    relations: {
      property: true,
    },
    order: {
      created_at: 'DESC',
    },
  });
}
// pay bill for a tenant
async payBill(
  tenantId: number,
  billId: number,
): Promise<TransactionEntity> {

  const bill =
    await this.tenantBillRepository.findOne({
      where: {
        id: billId,
        tenant: {
          id: tenantId,
        },
      },
      relations: {
        tenant: true,
        property: {
          landlord: true,
        },
        landlord: true,
        transaction: true,
      },
    });

  if (!bill) {
    throw new NotFoundException(
      'Bill not found for this tenant.',
    );
  }

  if (bill.status === BillStatus.paid) {
    throw new BadRequestException(
      'Bill is already paid.',
    );
  }

  
  if (bill.transaction) {
    throw new BadRequestException(
      'Payment already submitted for this bill.',
    );
  }

  const transaction =
    this.transactionRepository.create({
      type: bill.type,
      amount: Number(bill.amount),
      tenant_id: bill.tenant,
      property_id: bill.property,
      landlord: bill.landlord,
      payer_type: payer_type.tenant,
      status: status.pending,
      created_by_type:
        created_by_type.tenant,
    });

  const savedTransaction =
    await this.transactionRepository.save(
      transaction,
    );

  bill.transaction = savedTransaction;

  await this.tenantBillRepository.save(bill);

  return savedTransaction;
}

//payable WorkOrder GET method

async getPayableWorkOrders(tenantId: number): Promise<WorkOrder[]> {
  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  const workOrders = await this.workOrderRepository.find({
    where: {
      tenant: { id: tenantId },
      status: OrderStatus.COMPLETE,
    },
    relations: {
      property: true,
      landlord: true,
      transaction: true,
    },
  });

  // Only completed work orders that do not have a payment transaction yet
  return workOrders.filter(
    (workOrder) => !workOrder.transaction,
  );
}

//pay work order for a tenant

async payWorkOrder(
  tenantId: number,
  workOrderId: number,
): Promise<TransactionEntity> {
  const workOrder = await this.workOrderRepository.findOne({
    where: {
      id: workOrderId,
      tenant: { id: tenantId },
    },
    relations: {
      tenant: true,
      property: true,
      landlord: true,
      transaction: true,
    },
  });

  if (!workOrder) {
    throw new NotFoundException('Work order not found for this tenant.');
  }

if (!workOrder.tenant) {
  throw new BadRequestException(
    'This work order is not assigned to a tenant.',
  );
}

  if (workOrder.status !== OrderStatus.COMPLETE) {
    throw new BadRequestException('Work order is not complete yet.');
  }

  if (workOrder.transaction) {
    throw new BadRequestException(
      'Payment already submitted for this work order.',
    );
  }

  const amount =
    Number(workOrder.labor_cost) +
    Number(workOrder.materials_cost) +
    Number(workOrder.additional_cost);

  if (amount <= 0) {
    throw new BadRequestException('Work order has no payable cost.');
  }

  const transaction = this.transactionRepository.create({
    type: Transaction_type.work_order_cost,
    amount,
    tenant_id: workOrder.tenant,
    property_id: workOrder.property,
    landlord: workOrder.landlord,
    work_order_id: workOrder,
    payer_type: payer_type.tenant,
    status: status.pending,
    created_by_type: created_by_type.tenant,
  });

  return await this.transactionRepository.save(transaction);
}
 }
