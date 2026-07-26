import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Worker } from './entities/worker.entity';
import { workOrder } from './entities/work-order.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Worker,
      workOrder,
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
