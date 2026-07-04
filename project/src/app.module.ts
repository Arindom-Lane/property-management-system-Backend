import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LandlordModule } from './landlord/landlord.module';
import { TenantModule } from './tenant/tenant.module';
import { StaffModule } from './staff/staff.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [AdminModule, LandlordModule, TenantModule, StaffModule, TypeOrmModule.forRoot({
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'admin',
password: 'admin',
database: 'property_Management_system',
autoLoadEntities: true,
synchronize: true,
}),],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
