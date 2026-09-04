import { BadRequestException,ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LandlordDto } from './dto/landlord.dto';
import type { UpdateLandlordDto } from './dto/update_landlord.dto';
import { LandlordEntity } from './entities/landlord.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { PropertyEntity } from './entities/property.entity';
import {Status} from './entities/property.entity.js';
import { ListingStatus } from './entities/property.entity.js';
import { TenantEntity } from '../tenant/entities/tenant.entity.js';
import { TenantStatus } from '../tenant/entities/tenant.entity.js';
import { WorkOrder } from '../staff/entities/work_order.entity.js';
import { CreateWorkOrderDto } from '../staff/dto/CreateWorkOrder.dto';
import { TransactionEntity,Transaction_type,  } from './entities/transaction.entity';
import {
  TenantBillEntity,
  BillStatus,
} from './entities/tenant-bill.entity';
import { CreateTenantBillDto } from './dto/create-tenant-bill.dto';
import { IssueEntity } from 'src/tenant/entities/issue.entity';

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
    @InjectRepository(TenantBillEntity)
    private tenantBillRepository: Repository<TenantBillEntity>,
    @InjectRepository(IssueEntity)
    private issueRepository: Repository<IssueEntity>,
  ) {}



  

  /////////Authentication

  registerLandlord(landlordDto: LandlordDto): Promise<LandlordEntity> {
    const landlord = this.landlordRepository.create(landlordDto);
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

    async updateLandlordPassword(id: number, password_hash: string,newpassword:string): Promise<LandlordEntity> {
        if (password_hash === newpassword) {
            throw new UnauthorizedException('New password cannot be the same as the current password');
        }

        const landlord = await this.landlordRepository.findOne({ where: { id } });

        if (!landlord) {
            throw new UnauthorizedException('Landlord not found');
        }

        if (landlord.password_hash !== password_hash) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        landlord.password_hash = newpassword;
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

      const landlord = this.landlordRepository.findOne({
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
      if (property.has_parking = false){

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
      });

      if (!tenant) {
        throw new UnauthorizedException('Tenant not found');
      }

      tenant.status = TenantStatus.APPROVED;
      return this.tenantRepository.save(tenant);
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
      });

      if (!tenant) {
        throw new UnauthorizedException('Tenant not found');
      }

      tenant.status = TenantStatus.REJECTED;
      return this.tenantRepository.save(tenant);
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
//Assign Property to Tenant
async assignPropertyToTenant(
  landlordId: number,
  tenantId: number,
  propertyId: number,
): Promise<TenantEntity> {

  const landlord = await this.landlordRepository.findOne({
    where: { id: landlordId },
  });

  if (!landlord) {
    throw new NotFoundException('Landlord not found');
  }

  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found');
  }

  if (tenant.status !== TenantStatus.APPROVED) {
    throw new BadRequestException(
      'Tenant must be approved before assigning property',
    );
  }

  const property = await this.propertyRepository.findOne({
    where: {
      id: propertyId,
      landlord: { id: landlordId },
    },
    relations: {
      landlord: true,
    },
  });

  if (!property) {
    throw new NotFoundException(
      'Property not found for this landlord',
    );
  }

  if (property.status !== Status.VACANT) {
    throw new BadRequestException(
      'Property is not vacant',
    );
  }

  tenant.property = property;
  tenant.approved_by = landlord;

  property.status = Status.OCCUPIED;

  await this.propertyRepository.save(property);

  return await this.tenantRepository.save(tenant);
}

//create tenant bill
async createTenantBill(
  landlordId: number,
  dto: CreateTenantBillDto,
): Promise<TenantBillEntity> {

  const tenant =
    await this.tenantRepository.findOne({
      where: {
        id: dto.tenantId,
      },
      relations: {
        property: {
          landlord: true,
        },
      },
    });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found',
    );
  }

  if (!tenant.property) {
    throw new BadRequestException(
      'Tenant has no assigned property',
    );
  }

  if (
    tenant.property.landlord.id !== landlordId
  ) {
    throw new ForbiddenException(
      'This tenant does not belong to you',
    );
  }

  const allowedTypes = [
    Transaction_type.electricity,
    Transaction_type.water,
    Transaction_type.gas,
  ];

  if (!allowedTypes.includes(dto.type)) {
    throw new BadRequestException(
      'Only utility bills can be created here',
    );
  }

  const existing =
    await this.tenantBillRepository.findOne({
      where: {
        tenant: {
          id: dto.tenantId,
        },
        type: dto.type,
        month: dto.month,
      },
    });

  if (existing) {
    throw new BadRequestException(
      'Bill already exists for this month',
    );
  }

  const bill =
    this.tenantBillRepository.create({
      tenant,
      property: tenant.property,
      landlord: tenant.property.landlord,
      type: dto.type,
      amount: dto.amount,
      month: dto.month,
      status: BillStatus.unpaid,
    });

  return await this.tenantBillRepository.save(
    bill,
  );
}

  }







