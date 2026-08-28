import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { StaffEntity } from './entities/staff.entity';
import { WorkOrder } from './entities/work_order.entity';
import { WorkerEntity } from './entities/worker.entity';
import { AdminEntity } from "../admin/entities/admin.entity";
import { IssueEntity } from '../tenant/entities/issue.entity';
import { PropertyEntity } from "../landlord/entities/property.entity";
import { LandlordEntity } from "../landlord/entities/landlord.entity";
import { TenantEntity } from "../tenant/entities/tenant.entity";
import { TransactionEntity } from '../landlord/entities/transaction.entity'
import { BlockEntity } from "../admin/entities/block.entity";
import { BuildingEntity } from "../admin/entities/building.entity";
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule,TypeOrmModule.forFeature([
  TransactionEntity,BuildingEntity,
  ReviewEntity,
  StaffEntity,
  WorkOrder,
  WorkerEntity,
  AdminEntity,
  IssueEntity,
  PropertyEntity,
  LandlordEntity,
  TenantEntity,
  BlockEntity,
]),AuthModule],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService]
})
export class StaffModule {}
