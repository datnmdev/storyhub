import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Notification } from '../../notification/entities/notification.entity';
import { User } from '../../user/entities/user.entity';

@Index('FK_notificationUser_user_idx', ['receiverId'], {})
@Index('FK_notificationUser_notification_idx', ['notificationId'], {})
@Entity('notification_user', { schema: 'storyhub' })
export class NotificationUser {
  @Column('int', {
    primary: true,
    name: 'receiver_id',
    comment: '- receiver là người nhận thông báo',
  })
  receiverId: number;

  @Column('int', { primary: true, name: 'notification_id' })
  notificationId: number;

  @Column('enum', {
    name: 'status',
    enum: ['created', 'sent', 'viewed'],
  })
  status: 'created' | 'sent' | 'viewed';

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(
    () => Notification,
    (notification) => notification.notificationUsers,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'notification_id', referencedColumnName: 'id' }])
  notification: Notification;

  @ManyToOne(() => User, (user) => user.notificationUsers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'receiver_id', referencedColumnName: 'id' }])
  receiver: User;
}
