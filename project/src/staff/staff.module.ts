import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [],
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}
