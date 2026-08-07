import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LandlordModule } from './landlord/landlord.module';
import { TenantModule } from './tenant/tenant.module';
import { StaffModule } from './staff/staff.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { staffAuthService } from './staff/StaffAuth/staffAuth.service';
import { staffAuthController } from './staff/StaffAuth/staffAuth.controller';
import { StaffAuthModule  } from './staff/StaffAuth/staffAuth.module';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [AdminModule, LandlordModule, TenantModule, StaffModule, AuthModule, MailModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '127415@@', // please keep the password: admin
    // admin is the default passowrd, keep it as is in the postgreSQL as well
    database: 'property_Management_system',
    autoLoadEntities: true,
    synchronize: true,
  }), StaffAuthModule ,],
  controllers: [AppController, staffAuthController],
  providers: [AppService, staffAuthService],
})
export class AppModule { }
