import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantEntity } from './entities/tenant.entity';
import { IssueEntity } from './entities/issue.entity';
import { PropertyEntity } from '../landlord/entities/property.entity';
import { LandlordEntity } from '../landlord/entities/landlord.entity';
import {AuthModule } from '../auth/auth.module'
import { JwtModule } from '@nestjs/jwt';    

import { TransactionEntity } from '../landlord/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantEntity,
      IssueEntity,
      PropertyEntity,
      LandlordEntity,
      TransactionEntity,
    ]),
    AuthModule,
  ],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}