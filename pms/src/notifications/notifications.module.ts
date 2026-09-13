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