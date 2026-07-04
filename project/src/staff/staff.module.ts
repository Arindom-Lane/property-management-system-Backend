import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { DataSource } from 'typeorm';


@Module({
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}
