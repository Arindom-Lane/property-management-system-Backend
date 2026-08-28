import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { BlockEntity } from './entities/block.entity';
import { BuildingEntity } from './entities/building.entity';
import { LandlordEntity } from '../landlord/entities/landlord.entity';
import { StaffEntity } from '../staff/entities/staff.entity';
import { TenantEntity } from '../tenant/entities/tenant.entity';
import { PropertyEntity } from '../landlord/entities/property.entity';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import {AuthModule } from '../auth/auth.module'



@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity,BlockEntity,BuildingEntity, LandlordEntity, TenantEntity, StaffEntity, PropertyEntity,]),AuthModule],
  providers: [AdminService, BlockService, BuildingService,],
  controllers: [AdminController,  BlockController, BuildingController],
})
export class AdminModule {}
