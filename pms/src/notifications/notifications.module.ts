import { Module } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { PusherController } from './pusher.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PusherService],
  controllers: [PusherController],
  exports: [PusherService],
})
export class NotificationsModule {}


// WorkOrder #15
//       ↓
// worker = Rahim
//       ↓
// status = ASSIGNED
//       ↓
// save PostgreSQL
//       ↓
// Pusher trigger
//       ↓
// private-tenant-7
//       ↓
// work-order-assigned