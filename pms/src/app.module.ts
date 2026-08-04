import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LandlordModule } from './landlord/landlord.module';
import { TenantModule } from './tenant/tenant.module';
import { StaffModule } from './staff/staff.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AdminModule, LandlordModule, TenantModule, StaffModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin', // please keep the password: admin
    // admin is the default passowrd, keep it as is in the postgreSQL as well
    database: 'property_Management_system',
    autoLoadEntities: true,
    synchronize: true,
  }), AuthModule,],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule { }
