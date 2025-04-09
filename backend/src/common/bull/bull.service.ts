import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JobName, QueueName } from '../constants/bull.constants';

@Injectable()
export class BullService {
  constructor(
    @InjectQueue(QueueName.MAIL)
    private readonly mailQueue: Queue,
    @InjectQueue(QueueName.NOTIFICATION)
    private readonly notificationQueue: Queue
  ) {}

  addMailJob(name: JobName, data: any) {
    return this.mailQueue.add(name, data, {
      attempts: 10,
    });
  }

  addNotificationJob(name: JobName, data: any) {
    return this.notificationQueue.add(name, data, {
      attempts: 10,
    });
  }
}
