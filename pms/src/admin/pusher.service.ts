import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Pusher from 'pusher';

/* ============================================================
   PUSHER SERVICE (server side of the real-time feature)
   ------------------------------------------------------------
   PusherJS is used for REAL-TIME announcement notifications:
   when an admin publishes an announcement, this service
   triggers an event on the "announcements" channel and every
   connected client (other roles' dashboards) receives it
   instantly, without polling.

   The server side holds the SECRET keys (never exposed to the
   browser). Credentials come from environment variables so the
   app still boots safely when they are not configured:
   if any key is missing, notifications are silently skipped.
   ============================================================ */

@Injectable()
export class PusherService implements OnModuleInit {
  private readonly logger = new Logger(PusherService.name);
  private pusher: Pusher | null = null;

  // Initialize the Pusher server client once when the module starts.
  onModuleInit() {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER ?? 'ap1';

    if (!appId || !key || !secret) {
      // No credentials configured -> real-time simply stays off.
      this.logger.warn('Pusher env vars missing - real-time notifications disabled');
      return;
    }

    this.pusher = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });

    this.logger.log('Pusher server client initialized');
  }

  /* Broadcast a new announcement to ALL roles.
     Channel: "announcements" | Event: "new-announcement" */
  async notifyNewAnnouncement(payload: {
    id: number;
    title: string;
    body: string;
    created_by: string;
  }) {
    if (!this.pusher) return; // disabled -> no-op

    try {
      await this.pusher.trigger('announcements', 'new-announcement', payload);
    } catch (error) {
      // A notification failure must never break announcement creation.
      this.logger.error('Pusher trigger failed', error as string);
    }
  }
}
