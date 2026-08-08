import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantEntity } from './entities/tenant.entity';
import { IssueEntity } from './entities/issue.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';

import { JwtModule } from '@nestjs/jwt';    

import { AuthModule } from 'src/auth/auth.module';

import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantEntity,
      IssueEntity,
      PropertyEntity,
      LandlordEntity,
    ]),
    AuthModule,
    MailModule,
  ],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}