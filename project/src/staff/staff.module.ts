import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Worker } from './entities/worker.entity';
import { workOrder } from './entities/work-order.entity';
import {Review} from "./entities/review.entity"
import { LandlordEntity } from "../landlord/entities/landlord.entity"
import {Transaction } from "./entities/transaction.entity"
import {LandlordModule} from '../landlord/landlord.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Worker,
      workOrder,
      Review,Transaction,LandlordEntity,
    ]),LandlordModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
