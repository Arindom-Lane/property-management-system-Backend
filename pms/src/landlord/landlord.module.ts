import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordEntity } from './entities/landlord.entity';
import { PropertyEntity } from './entities/property.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LandlordEntity,PropertyEntity,TransactionEntity,TenantEntity])],
  providers: [LandlordService],
  controllers: [LandlordController]
})
export class LandlordModule {}
