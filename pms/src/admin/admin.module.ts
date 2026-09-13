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
import { AnnouncementEntity } from './entities/announcement.entity';
import { ComplaintEntity } from './entities/complaint.entity';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { PusherService } from './pusher.service';
import {AuthModule } from '../auth/auth.module'



@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity,BlockEntity,BuildingEntity, LandlordEntity, TenantEntity, StaffEntity, PropertyEntity, AnnouncementEntity, ComplaintEntity,]),AuthModule],
  providers: [AdminService, BlockService, BuildingService, AnnouncementService, ComplaintService, PusherService,],
  controllers: [AdminController,  BlockController, BuildingController, AnnouncementController, ComplaintController],
})
export class AdminModule {}
