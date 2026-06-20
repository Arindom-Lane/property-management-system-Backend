import { Module } from '@nestjs/common';
import { LandlordController } from './landlord.controller';
import { LandlordService } from './landlord.service';

@Module({
  controllers: [LandlordController],
  providers: [LandlordService]
})
export class LandlordModule {}
