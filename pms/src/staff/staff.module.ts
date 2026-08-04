import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { StaffEntity } from './entities/staff.entity';
import { WorkOrder } from './entities/work_order.entity';
import { WorkerEntity } from './entities/worker.entity';
import { AdminEntity } from "src/admin/entities/admin.entity";
import { IssueEntity } from 'src/tenant/entities/issue.entity';
import { PropertyEntity } from "src/landlord/entities/property.entity";
import { LandlordEntity } from "src/landlord/entities/landlord.entity";
import { TenantEntity } from "src/tenant/entities/tenant.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity,StaffEntity,WorkOrder,WorkerEntity,AdminEntity,IssueEntity,PropertyEntity,LandlordEntity,TenantEntity])],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService]
})
export class StaffModule {}
