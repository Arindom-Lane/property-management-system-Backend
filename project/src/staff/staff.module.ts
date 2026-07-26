import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Worker } from './entities/worker.entity';
import { WorkOrder } from './entities/work-order.entity';
import { WorkerCategory } from './entities/worker-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  import: [TypeOrmModule.forFeature([Worker, WorkOrder, WorkerCategory])]
  providers: [StaffService]
})
export class StaffModule {}
