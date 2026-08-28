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



@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantEntity,
      IssueEntity,
      PropertyEntity,
      LandlordEntity,
    ]),
    AuthModule,
  ],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}