import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';

@Module({
  providers: [TenantService],
  controllers: [TenantController]
})
export class TenantModule {}
