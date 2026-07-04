import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { staffData } from './staffData.entity';


@Module({
  imports: [TypeOrmModule.forFeature([staffData]),],
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}
