import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LandlordDto } from './dto/landlord.dto';
import type { UpdateLandlordDto } from './dto/update_landlord.dto';
import { LandlordEntity } from './entities/landlord.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyEntity } from './entities/property.entity';
import {Status} from './entities/property.entity.js';
import { ListingStatus } from './entities/property.entity.js';
import { TenantEntity } from '../tenant/entities/tenant.entity.js';
import { TenantStatus } from '../tenant/entities/tenant.entity.js';
import { WorkOrder } from '../staff/entities/work_order.entity.js';
import { CreateWorkOrderDto } from '../staff/dto/CreateWorkOrder.dto';
import { created_by_type, payer_type, TransactionEntity, Trnsaction_type,status, } from './entities/transaction.entity';
import { CreateTransactionDto } from 'src/staff/dto/CreateTransaction.dto';
import { IssueEntity } from '../tenant/entities/issue.entity';
import * as bcrypt from 'bcrypt';
import { CreateIssueDto } from 'src/tenant/dto/create-issue.dto';
import { PusherService } from 'src/notification/pusher.service';

@Injectable()
export class LandlordService {
constructor(
    @InjectRepository(LandlordEntity)
    private landlordRepository: Repository<LandlordEntity>,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(IssueEntity)
    private issueRepository: Repository<IssueEntity>,
    private pusherService: PusherService,
  ) {}



  

  /////////Authentication

  // landlord.service.ts — registerLandlord


async registerLandlord(landlordDto: LandlordDto): Promise<LandlordEntity> {
  const hashed = await bcrypt.hash(landlordDto.password_hash, 10);
  const landlord = this.landlordRepository.create({ ...landlordDto, password_hash: hashed });
  return this.landlordRepository.save(landlord);
}

  async loginLandlord(name: string, password_hash: string): Promise<{ message: string }> {
    const landlord = await this.landlordRepository.findOne({
      where: {
        name: name,
        password_hash: password_hash,
      },
    });

    if (!landlord) {
      throw new UnauthorizedException('Invalid name or password');
    }

    return { message: 'Login successful' };
  }


  //////////Profile

    getLandlordProfile(id: number): Promise<LandlordEntity | null> {
        return this.landlordRepository.findOne({
            where: { id: id },
        });
    }


    //// update full profile

    async updateLandlordProfile(id: number, UpdateLandlordDto: UpdateLandlordDto): Promise<LandlordEntity| null> {

        const landlord = await this.landlordRepository.findOne({ where: { id } });

        if (!landlord) {
            throw new UnauthorizedException('Landlord not found');
        }

        await this.landlordRepository.update( { id, }, { ... UpdateLandlordDto });    
        return this.landlordRepository.findOne({ where: { id:id } });
       }


       //////// update only password

    async updateLandlordPassword(
  id: number,
  currentPassword: string,
  newpassword: string,
): Promise<LandlordEntity> {
  const landlord = await this.landlordRepository.findOne({ where: { id } });

  if (!landlord) {
    throw new UnauthorizedException('Landlord not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, landlord.password_hash);
  if (!isMatch) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  const isSame = await bcrypt.compare(newpassword, landlord.password_hash);
  if (isSame) {
    throw new UnauthorizedException('New password cannot be the same as the current password');
  }

  landlord.password_hash = await bcrypt.hash(newpassword, 10);
  return this.landlordRepository.save(landlord);
}


    //////  property

    async getLandlordProperties(id: number): Promise<PropertyEntity[] | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      return landlord.properties;
    }


    async getLandlordPropertyById(landlordId: number, propertyId: number): Promise<PropertyEntity | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: propertyId, landlord: { id: landlordId } },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found for this landlord');
      }

      return property;
    }

    async updatePropertyRent(landlordId: number, propertyId: number, rent_amount: number): Promise<PropertyEntity | null> {

      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: propertyId, landlord: { id: landlordId } },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found for this landlord');
      }

      property.rent_amount = rent_amount;
      return this.propertyRepository.save(property);
      
    }

    async updatePropertyServiceCharge(landlordId: number, propertyId: number, service_charge: number): Promise<PropertyEntity | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: propertyId, landlord: { id: landlordId } },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found for this landlord');
      }

      property.service_charge = service_charge;
      return this.propertyRepository.save(property);
    } 

    async updatePropertyParking(landlordId: number, propertyId: number, parking: number): Promise<PropertyEntity | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: propertyId, landlord: { id: landlordId }  , has_parking: true },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found for this landlord');
      }
      if (!property.has_parking){

        throw new UnauthorizedException('There is no parking for this property');
      }
      property.parking_fee = parking;
      return this.propertyRepository.save(property);
    }

    async updatePropertyListingStatus(landlordId: number, propertyId: number, listing_status: ListingStatus): Promise<PropertyEntity | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: propertyId, landlord: { id: landlordId } },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found for this landlord');
      }

      property.listing_status = listing_status ;
      return this.propertyRepository.save(property);
    }

    async updatePropertyStatus(landlordId: number, propertyId: number, status: Status): Promise<PropertyEntity | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { properties: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: propertyId, landlord: { id: landlordId } },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found for this landlord');
      }

      property.status = status;
      return this.propertyRepository.save(property);
    }

    ///////////////////////// landlord's tenants

    async gettenanantsbylandlordid(landlordid:number):Promise<TenantEntity[] | null>{

      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordid },
        relations: { tenants: true },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      return landlord.tenants;

    }


    ///////////// approve tenant
    
    async approveTenant(landlordid:number, tenantid:number):Promise<TenantEntity | null>{

    const landlord = await this.landlordRepository.findOne({
      where: { id: landlordid },
      relations: { tenants: true },
    });

    if (!landlord) {
      throw new UnauthorizedException('Landlord not found');
    }
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantid },
      relations: { property: true }, // NEW: to include unit number in the toast
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    tenant.status = TenantStatus.APPROVED;
    const saved = await this.tenantRepository.save(tenant);

    // NEW: notify the tenant in real time
    void this.pusherService.notifyTenantStatusChanged(saved.id, {
      status: 'APPROVED',
      propertyUnit: saved.property?.unit_number ?? null,
    });

    return saved;
  }


    ///////////// reject tenant

    async rejectTenant(landlordid:number, tenantid:number):Promise<TenantEntity | null>{

    const landlord = await this.landlordRepository.findOne({
      where: { id: landlordid },
      relations: { tenants: true },
    });

    if (!landlord) {
      throw new UnauthorizedException('Landlord not found');
    }
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantid },
      relations: { property: true }, // NEW
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    tenant.status = TenantStatus.REJECTED;
    const saved = await this.tenantRepository.save(tenant);

    // NEW: notify the tenant in real time
    void this.pusherService.notifyTenantStatusChanged(saved.id, {
      status: 'REJECTED',
      propertyUnit: saved.property?.unit_number ?? null,
    });

    return saved;
  }



    ///////kick approved tenant
    
    async kickTenant(landlordid:number, tenantid:number):Promise<TenantEntity | null>{

    const landlord = await this.landlordRepository.findOne({
      where: { id: landlordid },
      relations: { tenants: true },
    });

    if (!landlord) {
      throw new UnauthorizedException('Landlord not found');
    }
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantid },
      relations: { property: true }, // NEW
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    const unit = tenant.property?.unit_number ?? null; // grab before it's cleared elsewhere
    tenant.status = TenantStatus.REJECTED;
    const saved = await this.tenantRepository.save(tenant);

    // NEW: notify the tenant in real time
    void this.pusherService.notifyTenantStatusChanged(saved.id, {
      status: 'REJECTED',
      propertyUnit: unit,
    });

    return saved;
  }


    ////// create work order
    
    async createWorkOrder(landlordId: number, CreateWorkOrderDto: CreateWorkOrderDto): Promise<WorkOrder> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }


      const workOrder = this.workOrderRepository.create({
        ...CreateWorkOrderDto,
        landlord: landlord,
      });

      return this.workOrderRepository.save(workOrder);
    }



    ////// get landlord work orders
    
    async getLandlordWorkOrders(landlordId: number): Promise<WorkOrder[] | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
      });
      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const workOrders = await this.workOrderRepository.find({
        where: { landlord: { id: landlordId } },
      });

      if (!workOrders) {
        throw new UnauthorizedException('No work orders found for this landlord');
      }

      return workOrders;
    }

///////////////Transactions


   

    async getLandlordTransactions (landlordId: number): Promise<TransactionEntity[] | null> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
      });
      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const transactions = await this.landlordRepository.findOne({
        where: { id: landlordId },
        relations: { transactions: true },
      });

      if (!transactions) {
        throw new UnauthorizedException('No transactions found for this landlord');
      }

      return transactions.transactions;
    }


    getLandlordDashboardSummery(landlordId: number): Promise<any> {
      return this.landlordRepository.query(
        `
        SELECT
          (SELECT COUNT(*) FROM property WHERE "landlordId" = $1) AS total_properties,
          (SELECT COUNT(*) FROM tenant WHERE approved_by = $1) AS total_tenants,
          (SELECT COUNT(*) FROM work_order WHERE landlord_id = $1) AS total_work_orders,
          (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE "landlordId" = $1 AND status = 'paid') AS total_income
        `,
        [landlordId],
      );
    }
    
//////////issue get 

    async getLandlordIssuesofTenants(landlordId: number): Promise<any> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
      });
      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const issues = await this.issueRepository.find({
        where: { landlord: { id: landlordId } },
      });

      if (!issues) {
        throw new UnauthorizedException('No issues found for this landlord');
      }

      return issues;
    }

    /////////////////issue create

    async createIssuebyLandlord(landlordId: number, CreateIssueDto: CreateIssueDto): Promise<any> {
      const landlord = await this.landlordRepository.findOne({
        where: { id: landlordId },
      });

      if (!landlord) {
        throw new UnauthorizedException('Landlord not found');
      }

      const property = await this.propertyRepository.findOne({
        where: { id: CreateIssueDto.property, landlord: { id: landlordId } },
      });

      if (!property) {
        throw new UnauthorizedException('Property not found or does not belong to this landlord');
      }
      
      const issue = this.issueRepository.create({
        description: CreateIssueDto.description,
        image_url: CreateIssueDto.image_url,
        landlord: landlord,
        property: property,
      });

      return this.issueRepository.save(issue);
    }


    ////////assign property to tenant

    async assignPropertyToTenant(landlordId: number, tenantId: number, propertyId: number): Promise<TenantEntity | null> {
        const landlord = await this.landlordRepository.findOne({
            where: { id: landlordId },
        });

        if (!landlord) {
            throw new UnauthorizedException('Landlord not found');
        }

        const property = await this.propertyRepository.findOne({
            where: { id: propertyId, landlord: { id: landlordId } },
        });

        if (!property) {
            throw new UnauthorizedException('Property not found or does not belong to this landlord');
        }

        const tenant = await this.tenantRepository.findOne({
            where: { id: tenantId, approved_by: { id: landlordId } },
        });

        if (!tenant) {
            throw new UnauthorizedException('Tenant not found or not approved by this landlord');
        }

        tenant.property = property;
        return this.tenantRepository.save(tenant);
    }


    /// review


    getLandlordReviews(landlordId: number): Promise<any> {
      return this.landlordRepository.query(
        `
        SELECT i.* 
        FROM review i
        JOIN work_order w ON i."work_order_id" = w.id
        WHERE w.landlord_id = $1
        `,
        [landlordId],
      );
    }


    ///////////landlord make bills payment in transaction 

    async createTransaction(
  landlordId: number,
  dto: CreateTransactionDto,
): Promise<TransactionEntity> {

  const landlord = await this.landlordRepository.findOne({
    where: { id: landlordId },
  });

  if (!landlord) {
    throw new UnauthorizedException('Landlord not found');
  }

  const property = await this.propertyRepository.findOne({
    where: { id: dto.property_id },
  });

  if (!property) {
    throw new UnauthorizedException('Property not found');
  }

  const transaction = this.transactionRepository.create({
    type: dto.type,
    amount: dto.amount,
    property_id: property,
    landlord: landlord,
    payer_type: dto.payer_type,
    status: dto.status,
  });

  return this.transactionRepository.save(transaction);
}

///////////////////issue update by landlord

updateIssue(landlordId: number, issueId: number, updateData: Partial<IssueEntity>): Promise<IssueEntity | null> {
  return this.issueRepository.findOne({ where: { id: issueId, landlord: { id: landlordId } } })
    .then(issue => {
      if (!issue) {
        throw new UnauthorizedException('Issue not found or does not belong to this landlord');
      }
      Object.assign(issue, updateData);
      return this.issueRepository.save(issue);
    });
} 

///landlord pays his utility bill
async payUtilityBill(
  landlordId: number,
  transactionId: number,
): Promise<TransactionEntity> {

  const transaction = await this.transactionRepository.findOne({
    where: {
      id: transactionId,
      landlord: { id: landlordId },
      payer_type: payer_type.landlord,
      status: status.pending,
    },
    relations: {
      property_id: true,
      landlord: true,
    },
  });

  if (!transaction) {
    throw new UnauthorizedException(
      'Utility bill transaction not found',
    );
  }

  // Do not allow rent to be paid through this method
  if (
    transaction.type === Trnsaction_type.rent ||
    transaction.type === Trnsaction_type.work_order_cost
  ) {
    throw new UnauthorizedException(
      'Rent and work order transactions cannot be paid as utility bills',
    );
  }

  transaction.status = status.paid;
  transaction.paid_at = new Date();

  return await this.transactionRepository.save(transaction);
}

getTenantTransactions(landlordId: number, tenantId: number): Promise<TransactionEntity[] | null> {
  return this.transactionRepository.find({
    where: {
      landlord: { id: landlordId },
      tenant_id: { id: tenantId },
    },
    relations: {
      property_id: true,
      landlord: true,
      tenant_id: true,
    },
  });
}

createTransactionForUtilityBill(
  landlordId: number,
  dto: CreateTransactionDto,
): Promise<TransactionEntity> {
  return this.createTransaction(landlordId, dto);
}

//////////////////// Create transaction for a work order

async createWorkOrderTransaction(
  landlordId: number,
  workOrderId: number,
): Promise<TransactionEntity> {
  // 1. Check landlord
  const landlord = await this.landlordRepository.findOne({
    where: { id: landlordId },
  });

  if (!landlord) {
    throw new UnauthorizedException('Landlord not found');
  }

  // 2. Find the work order
  const workOrder = await this.workOrderRepository.findOne({
    where: {
      id: workOrderId,
      landlord: { id: landlordId },
    },
    relations: {
      landlord: true,
      property: true,
    },
  });

  if (!workOrder) {
    throw new UnauthorizedException(
      'Work order not found or does not belong to this landlord',
    );
  }

  // 3. Calculate the work order cost
  const laborCost = Number(workOrder.labor_cost ?? 0);
  const materialsCost = Number(workOrder.materials_cost ?? 0);
  const additionalCost = Number(workOrder.additional_cost ?? 0);

  const totalAmount =
    laborCost +
    materialsCost +
    additionalCost;

  // 4. Do not create a transaction if there is no cost
  if (totalAmount <= 0) {
    throw new UnauthorizedException(
      'This work order has no cost',
    );
  }

  // 5. Check whether a transaction already exists
  const existingTransaction =
    await this.transactionRepository.findOne({
      where: {
        landlord: { id: landlordId },
        work_order_id: { id: workOrderId },
        type: Trnsaction_type.work_order_cost,
      },
      relations: {
        work_order_id: true,
        property_id: true,
        landlord: true,
      },
    });

  if (existingTransaction) {
    return existingTransaction;
  }

  // 6. Create a new transaction
  const transaction =
    this.transactionRepository.create({
      type: Trnsaction_type.work_order_cost,
      amount: totalAmount,
      landlord: landlord,
      work_order_id: workOrder,
      property_id: workOrder.property,
      payer_type: payer_type.landlord,
      status: status.pending,
      created_by_type: created_by_type.landlord,
    });

  // 7. Save transaction
  return await this.transactionRepository.save(transaction);
}
  }


