import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PusherService } from './pusher.service';
import { AuthGuard } from '../auth/auth.guard';
import { AccountType } from '../auth/dto/login.dto';

@Controller('pusher')
export class PusherController {

  constructor(
    private readonly pusherService: PusherService,
  ) {}

  @Post('auth')
  @UseGuards(AuthGuard)
  authorizeChannel(
    @Req() req,
    @Body() body,
  ) {
    const socketId = body.socket_id;
    const channelName = body.channel_name;

    if (req.user.accountType !== AccountType.TENANT) {
      throw new ForbiddenException(
        'Only tenants can access tenant notification channels',
      );
    }

    const correctChannel =
      `private-tenant-${req.user.sub}`;

    if (channelName !== correctChannel) {
      throw new ForbiddenException(
        'You are not allowed to access this channel',
      );
    }

    return this.pusherService.authorizeChannel(
      socketId,
      channelName,
    );
  }
}