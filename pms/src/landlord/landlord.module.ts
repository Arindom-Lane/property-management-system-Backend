import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordEntity } from './entities/landlord.entity';
import { PropertyEntity } from './entities/property.entity';
import { TransactionEntity } from './entities/transaction.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LandlordEntity,PropertyEntity,TransactionEntity])],
  providers: [LandlordService],
  controllers: [LandlordController]
})
export class LandlordModule {}
