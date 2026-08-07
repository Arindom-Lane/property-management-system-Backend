import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { TransactionEntity } from './entities/transaction.entity';

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





  }







