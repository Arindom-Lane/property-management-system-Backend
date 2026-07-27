import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { LandlordEntity } from './entities/landloard.entity';


@Module({
  imports: [TypeOrmModule.forFeature([LandlordEntity])],
  controllers: [LandlordController],
  providers: [LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}