import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService {

  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }

  async sendToTenant(
    tenantId: number,
    eventName: string,
    data: any,
  ) {
    const channelName = `private-tenant-${tenantId}`;

    return await this.pusher.trigger(
      channelName,
      eventName,
      data,
    );
  }

  authorizeChannel(
    socketId: string,
    channelName: string,
  ) {
    return this.pusher.authorizeChannel(
      socketId,
      channelName,
    );
  }
}