import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

import { Category } from './entities/category.entity';
import { Worker } from './entities/worker.entity';
import { WorkerCategory } from './entities/worker-category.entity';
import { WorkOrder } from './entities/work-order.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Worker,
      WorkerCategory,
      WorkOrder,
      Review,
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
