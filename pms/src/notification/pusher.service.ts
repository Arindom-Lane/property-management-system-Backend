import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService implements OnModuleInit {
  private readonly logger = new Logger(PusherService.name);
  private pusher: Pusher | null = null;

  onModuleInit() {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER ?? 'ap1';

    if (!appId || !key || !secret) {
      this.logger.warn('Pusher env vars missing - real-time notifications disabled');
      return;
    }

    this.pusher = new Pusher({ appId, key, secret, cluster, useTLS: true });
    this.logger.log('Pusher server client initialized (shared/notifications)');
  }

 private async safeTrigger(channel: string, event: string, payload: any) {
  console.log('[Pusher] safeTrigger called:', channel, event, payload);
  if (!this.pusher) {
    console.log('[Pusher] client is NULL — env vars not loaded');
    return;
  }
  try {
    await this.pusher.trigger(channel, event, payload);
    console.log('[Pusher] trigger SUCCESS');
  } catch (error) {
    this.logger.error(`Pusher trigger failed (${event} on ${channel})`, error as string);
  }
}

  // ---------- LANDLORD EVENTS ----------

  async notifyLandlordNewIssue(
    landlordId: number,
    payload: { issueId: number; propertyId: number; unitNumber: string; description: string },
  ) {
    await this.safeTrigger(`landlord-${landlordId}`, 'new-issue', payload);
  }

  async notifyLandlordWorkOrderCreated(
    landlordId: number,
    payload: { workOrderId: number; propertyId: number; unitNumber: string },
  ) {
    await this.safeTrigger(`landlord-${landlordId}`, 'work-order-created', payload);
  }

  async notifyLandlordWorkOrderComplete(
    landlordId: number,
    payload: { workOrderId: number; propertyId: number; unitNumber: string; totalCost: number },
  ) {
    await this.safeTrigger(`landlord-${landlordId}`, 'work-order-complete', payload);
  }

  async notifyLandlordTransactionPaid(
    landlordId: number,
    payload: { transactionId: number; propertyId: number; unitNumber: string; amount: number; type: string },
  ) {
    await this.safeTrigger(`landlord-${landlordId}`, 'transaction-paid', payload);
  }

  // ---------- TENANT EVENTS ----------

  async notifyTenantStatusChanged(
    tenantId: number,
    payload: { status: 'APPROVED' | 'REJECTED'; propertyUnit?: string | null },
  ) {
    await this.safeTrigger(`tenant-${tenantId}`, 'tenant-status-changed', payload);
  }

  
}