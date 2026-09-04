import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordEntity } from './entities/landlord.entity';
import { PropertyEntity } from './entities/property.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TenantEntity } from '../tenant/entities/tenant.entity';
import { WorkOrder } from '../staff/entities/work_order.entity';
import { TenantBillEntity } from './entities/tenant-bill.entity';
import { IssueEntity } from 'src/tenant/entities/issue.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LandlordEntity,PropertyEntity,TransactionEntity,TenantEntity,TenantBillEntity,WorkOrder,IssueEntity])],
  providers: [LandlordService],
  controllers: [LandlordController]
})
export class LandlordModule {}
