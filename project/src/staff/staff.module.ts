import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Worker } from './entities/worker.entity';
import { workOrder } from './entities/work-order.entity';
import { Review } from "./entities/review.entity";
import { LandlordEntity } from "../landlord/entities/landlord.entity";
import { Transaction } from "./entities/transaction.entity";
import { StaffEntity } from "./entities/staff.entity";
import { MailService } from 'src/mail/mail.service';
import { AuthModule } from "../auth/auth.module";
import{JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([
      Worker,
      workOrder,
      Review, Transaction, LandlordEntity, StaffEntity,
    ])
  ],
  controllers: [StaffController],
  providers: [StaffService,MailService,JwtAuthGuard,JwtService],
  exports: [StaffService],
})
export class StaffModule { }
