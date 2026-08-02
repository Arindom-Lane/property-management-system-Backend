import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { StaffEntity } from './entities/staff.entity';
import { WorkOrder } from './entities/work_order.entity';
import { WorkerEntity } from './entities/worker.entity';
import { AdminEntity } from "src/admin/entities/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity,StaffEntity,WorkOrder,WorkerEntity,AdminEntity])],
  providers: [StaffService],
  controllers: [StaffController]
})
export class StaffModule {}
