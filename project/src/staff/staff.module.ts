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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Worker,
      workOrder,
      Review, Transaction, LandlordEntity, StaffEntity,
    ])
  ],
  controllers: [StaffController],
  providers: [StaffService,MailService],
  exports: [StaffService],
})
export class StaffModule { }
