import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { StaffData } from './staffData.entity';


@Module({
  imports: [TypeOrmModule.forFeature([StaffData]),],
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}
