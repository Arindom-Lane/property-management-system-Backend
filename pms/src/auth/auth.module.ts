import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AdminEntity } from '../admin/entities/admin.entity';
import { StaffEntity } from '../staff/entities/staff.entity';
import { LandlordEntity } from '../landlord/entities/landlord.entity';
import { TenantEntity } from '../tenant/entities/tenant.entity';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './jwt-secret';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      StaffEntity,
      LandlordEntity,
      TenantEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 200 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
