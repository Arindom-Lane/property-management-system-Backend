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
import { created_by_type, TransactionEntity } from './entities/transaction.entity';
import { CreateTransactionDto } from 'src/staff/dto/CreateTransaction.dto';
import * as bcrypt from 'bcrypt';

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
      return this.landlordRepository.query(
        `
        SELECT i.* 
        FROM issue i
        JOIN tenant t ON i."tenant_id" = t.id
        WHERE t.approved_by = $1
        `,
        [landlordId],
      );
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





  }


