import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';

@Module({
  providers: [LandlordService],
  controllers: [LandlordController]
})
export class LandlordModule {}
