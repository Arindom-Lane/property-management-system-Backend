import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { LandlordEntity } from './entities/landlord.entity';
import { PropertyEntity } from './entities/property.entity';
import { Review } from '../staff/entities/review.entity'
import { workOrder } from 'src/staff/entities/work-order.entity';



@Module({
  imports: [TypeOrmModule.forFeature([LandlordEntity,PropertyEntity,workOrder]), StaffModule,],
  controllers: [LandlordController],
  providers: [LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}