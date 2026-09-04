import { Controller, Post,Body, Get, Param, Put, Patch, ParseIntPipe } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordEntity } from './entities/landlord.entity';
import { LandlordDto } from './dto/landlord.dto';
import type { UpdateLandlordDto } from './dto/update_landlord.dto';
import { PropertyEntity } from './entities/property.entity';
import { Status } from './entities/property.entity.js';
import { ListingStatus } from './entities/property.entity.js';
import { TenantEntity } from '../tenant/entities/tenant.entity.js';
import { WorkOrder } from '../staff/entities/work_order.entity';
import { CreateTenantBillDto } from './dto/create-tenant-bill.dto';
@Controller('landlord')
export class LandlordController {
  constructor(private readonly landlordService: LandlordService) {}


  ///Authenticaation

  @Post('register')
     registerLandlord(@Body() landlordDto: LandlordDto): Promise<LandlordEntity> {
        return this.landlordService.registerLandlord(landlordDto);
    }

    @Post('login')
  loginLandLord(@Body('name') name: string,@Body('password_hash') password_hash: string,): Promise<{ message: string }> {
    return this.landlordService.loginLandlord(name, password_hash);
  }



    ///////////////Profile

    @Get('profile/:id')
     getLandlordProfilebyId(@Param('id') id: number): Promise<LandlordEntity | null> {
        return this.landlordService.getLandlordProfile(id);
    }

    //////// update full profile

    @Put('update/:id')
    updateLandlordProfile(@Param('id') id: number, @Body() UpdateLandlordDto: UpdateLandlordDto): Promise<LandlordEntity | null> {
        return this.landlordService.updateLandlordProfile(id, UpdateLandlordDto);
    }

    //////// update only password

    @Patch('update_password/:id')
    updateLandlordPassword(@Param('id') id: number,@Body('name') name: string,@Body('password_hash') password_hash: string,@Body('newpassword') newpassword:string): Promise<LandlordEntity> {
        return this.landlordService.updateLandlordPassword(id,password_hash,newpassword);
    }


    //////  property  

    @Get('properties/:landlordId/:propertyId') ///landlord er uder e 1 property er details dekhabe
    getLandlordPropertyById(@Param('landlordId') landlordId: number, @Param('propertyId') propertyId: number): Promise<PropertyEntity | null> {
        return this.landlordService.getLandlordPropertyById(landlordId, propertyId);
    }

    @Get('properties/:landlordId')  ///landlord er uder e shob property er details dekhabe
    getLandlordProperties(@Param('landlordId') landlordId: number): Promise<PropertyEntity[] | null> {
        return this.landlordService.getLandlordProperties(landlordId);
    }

    ////////////// Property details update by landlord

    @Patch('propety/update/rent/:landlordId/:propertyId')
    updatePropertyRent(@Param('landlordId') landlordId: number, @Param('propertyId') propertyId: number, @Body('rent_amount') rent_amount: number): Promise<PropertyEntity | null> {
        return this.landlordService.updatePropertyRent(landlordId, propertyId, rent_amount);
    }


    @Patch('propety/update/service_charge/:landlordId/:propertyId')
    updatePropertyServiceCharge(@Param('landlordId') landlordId: number, @Param('propertyId') propertyId: number, @Body('service_charge') service_charge: number): Promise<PropertyEntity | null> {
        return this.landlordService.updatePropertyServiceCharge(landlordId, propertyId, service_charge);
    }

    @Patch('propety/update/parking/:landlordId/:propertyId')
    updatePropertyParking(@Param('landlordId') landlordId: number, @Param('propertyId') propertyId: number, @Body('parking') parking: number): Promise<PropertyEntity | null> {
        return this.landlordService.updatePropertyParking(landlordId, propertyId, parking);
    }

    @Patch('propety/update/listing_status/:landlordId/:propertyId')
    updatePropertyListingStatus(@Param('landlordId') landlordId: number, @Param('propertyId') propertyId: number, @Body('listing_status') listing_status: ListingStatus): Promise<PropertyEntity | null> {
        return this.landlordService.updatePropertyListingStatus(landlordId, propertyId, listing_status);
    }

    @Patch('propety/update/status/:landlordId/:propertyId')
    updatePropertyStatus(@Param('landlordId') landlordId: number, @Param('propertyId') propertyId: number, @Body('status') status: Status): Promise<PropertyEntity | null> {
        return this.landlordService.updatePropertyStatus(landlordId, propertyId, status);
    }


    ///////////////// landlord er tenants

    @Get('tenants/:landlordid')
    gettenanantsbylandlordid(@Param('landlordid') landlordid:number):Promise<TenantEntity[] | null> {
        return this.landlordService.gettenanantsbylandlordid(landlordid);
    }

    //////////// approve tenant

    @Patch('tenant/approve/:landlordid/:tenantid')
    approveTenant(@Param('landlordid') landlordid:number, @Param('tenantid') tenantid:number):Promise<TenantEntity | null> {
        return this.landlordService.approveTenant(landlordid, tenantid);
    }

    //////////// reject tenant

    @Patch('tenant/reject/:landlordid/:tenantid')
    rejectTenant(@Param('landlordid') landlordid:number, @Param('tenantid') tenantid:number):Promise<TenantEntity | null> {
        return this.landlordService.rejectTenant(landlordid, tenantid);
    }


    ////// create work order

    @Post('workorder/:landlordId')
    createWorkOrder(@Param('landlordId') landlordId: number, @Body() workOrderDto: any): Promise<WorkOrder> {
        return this.landlordService.createWorkOrder(landlordId, workOrderDto);
    }



    /////////// get landlord work orders

    @Get('workorders/:landlordId')
    getLandlordWorkOrders(@Param('landlordId') landlordId: number): Promise<WorkOrder[] | null> {
        return this.landlordService.getLandlordWorkOrders(landlordId);
    }



    //////////////// view landlord transactions

    @Get('transactions/:landlordId')
    getLandlordTransactions(@Param('landlordId') landlordId: number): Promise<any> {
        return this.landlordService.getLandlordTransactions(landlordId);
    }
//Assign Property to Tenant
    @Patch('tenant/assign-property/:landlordid/:tenantid/:propertyid')
assignPropertyToTenant(
  @Param('landlordid', ParseIntPipe) landlordid: number,
  @Param('tenantid', ParseIntPipe) tenantid: number,
  @Param('propertyid', ParseIntPipe) propertyid: number,
): Promise<TenantEntity> {
  return this.landlordService.assignPropertyToTenant(
    landlordid,
    tenantid,
    propertyid,
  );
}

//tenant bill creation by landlord
@Post('tenant-bill/:landlordId')
createTenantBill(
  @Param('landlordId', ParseIntPipe)
  landlordId: number,

  @Body()
  dto: CreateTenantBillDto,
) {
  return this.landlordService.createTenantBill(
    landlordId,
    dto,
  );
}
    

}
