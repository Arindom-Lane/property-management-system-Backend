import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { Categories, LandlordEntity, Properties } from './landlord.entity';
import { Blocks } from './landlord.entity';
import { Buildings } from './landlord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LandlordEntity, Blocks, Buildings, Categories, Properties])],
  controllers: [LandlordController],
  providers: [LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}