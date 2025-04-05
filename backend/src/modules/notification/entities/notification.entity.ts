import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationUser } from './notification-user.entity';

@Entity('notification', { schema: 'storyhub' })
export class Notification {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'type',
    enum: [
      'story_notification',
      'comment_notification',
      'deposite_notification',
    ],
  })
  type: 'story_notification' | 'comment_notification' | 'deposite_notification';

  @Column('int', { name: 'reference_id' })
  referenceId: number;

  @OneToMany(
    () => NotificationUser,
    (notificationUser) => notificationUser.notification
  )
  notificationUsers: NotificationUser[];
}
