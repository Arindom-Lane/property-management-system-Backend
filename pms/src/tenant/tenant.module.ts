import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { IssueEntity } from './entities/issue.entity';
import { TenantEntity } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([IssueEntity, TenantEntity])],
  providers: [TenantService],
  controllers: [TenantController]
})
export class TenantModule {}
