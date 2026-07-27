import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { LandlordEntity } from './entities/landlord.entity';
import { PropertyEntity } from './entities/property.entity';
import { WorkOrderEntity } from './entities/work_order.entity';



@Module({
  imports: [TypeOrmModule.forFeature([LandlordEntity,PropertyEntity,WorkOrderEntity])],
  controllers: [LandlordController],
  providers: [LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}