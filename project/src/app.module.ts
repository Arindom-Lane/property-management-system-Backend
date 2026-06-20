import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LandlordModule } from './landlord/landlord.module';
import { TenantModule } from './tenant/tenant.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [AdminModule, LandlordModule, TenantModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
