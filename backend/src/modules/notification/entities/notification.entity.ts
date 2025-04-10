import { Comment } from '@/modules/comment/entities/comment.entity';
import { DepositeTransaction } from '@/modules/deposite-transaction/entities/deposite-transaction.entity';
import { ModerationRequest } from '@/modules/moderation-request/entities/moderation-request';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationUser } from './notification-user.entity';

@Index(
  'FK_notification_deposite-transaction_idx',
  ['depositeTransactionId'],
  {}
)
@Index('FK_notification_comment_idx', ['commentId'], {})
@Index('FK_notification_moderation-request_idx', ['moderationRequestId'], {})
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

  @Column('int', { name: 'deposite_transaction_id', nullable: true })
  depositeTransactionId: number | null;

  @Column('int', { name: 'comment_id', nullable: true })
  commentId: number | null;

  @Column('int', { name: 'moderation_request_id', nullable: true })
  moderationRequestId: number | null;

  @ManyToOne(() => Comment, (comment) => comment.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
  comment: Comment;

  @ManyToOne(
    () => DepositeTransaction,
    (depositeTransaction) => depositeTransaction.notifications,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'deposite_transaction_id', referencedColumnName: 'id' }])
  depositeTransaction: DepositeTransaction;

  @ManyToOne(
    () => ModerationRequest,
    (moderationRequest) => moderationRequest.notifications,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'moderation_request_id', referencedColumnName: 'id' }])
  moderationRequest: ModerationRequest;

  @OneToMany(
    () => NotificationUser,
    (notificationUser) => notificationUser.notification
  )
  notificationUsers: NotificationUser[];
}
