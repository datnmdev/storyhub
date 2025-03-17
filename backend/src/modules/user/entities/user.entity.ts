import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from '../../history/entities/history.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { ModerationRequest } from '../../moderation-request/entities/moderation-request';
import { NotificationUser } from '../../notification-user/entities/notification-user.entity';
import { RatingDetail } from '../../rating/entities/rating-detail.entity';
import { Story } from '../../story/entities/story.entity';
import { TranslationTask } from '../../translation-task/entities/translation-task.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { UserProfile } from '@/modules/user-profile/entities/user-profile.entity';
import { ChapterTranslation } from '@/modules/chapter-translation/entities/chapter-translation.entity';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { CommentInteraction } from '@/modules/comment-interaction/entities/comment-interaction.entity';
import { DepositeTransaction } from '@/modules/deposite-transaction/entities/deposite-transaction.entity';
import { Employee } from '@/modules/employee/entities/employee.entity';
import { FollowDetail } from '@/modules/follow/entities/follow-detail.entity';

@Entity('user', { schema: 'storyhub' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'auth_type',
    enum: ['email_password', 'google', 'facebook'],
  })
  authType: 'email_password' | 'google' | 'facebook';

  @Column('text', { name: 'email', nullable: true })
  email: string | null;

  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @Column('text', { name: 'suid', nullable: true })
  suid: string | null;

  @Column('enum', {
    name: 'status',
    enum: ['unactivated', 'activated', 'locked', 'deleted'],
  })
  status: 'unactivated' | 'activated' | 'locked' | 'deleted';

  @Column('enum', {
    name: 'role',
    enum: ['admin', 'reader', 'author', 'moderator', 'translator'],
  })
  role: 'admin' | 'reader' | 'author' | 'moderator' | 'translator';

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(
    () => ChapterTranslation,
    (chapterTranslation) => chapterTranslation.translator
  )
  chapterTranslations: ChapterTranslation[];

  @OneToMany(() => Comment, (comment) => comment.reader)
  comments: Comment[];

  @OneToMany(
    () => CommentInteraction,
    (commentInteraction) => commentInteraction.reader
  )
  commentInteractions: CommentInteraction[];

  @OneToMany(
    () => DepositeTransaction,
    (depositeTransaction) => depositeTransaction.reader
  )
  depositeTransactions: DepositeTransaction[];

  @OneToOne(() => Employee, (employee) => employee.user)
  employee: Employee;

  @OneToMany(() => FollowDetail, (followDetail) => followDetail.reader)
  followDetails: FollowDetail[];

  @OneToMany(() => History, (history) => history.reader)
  histories: History[];

  @OneToMany(() => Invoice, (invoice) => invoice.reader)
  invoices: Invoice[];

  @OneToMany(
    () => ModerationRequest,
    (moderationRequest) => moderationRequest.author
  )
  moderationRequests: ModerationRequest[];

  @OneToMany(
    () => ModerationRequest,
    (moderationRequest) => moderationRequest.moderator
  )
  moderationRequests2: ModerationRequest[];

  @OneToMany(
    () => NotificationUser,
    (notificationUser) => notificationUser.receiver
  )
  notificationUsers: NotificationUser[];

  @OneToMany(() => RatingDetail, (ratingDetail) => ratingDetail.reader)
  ratingDetails: RatingDetail[];

  @OneToMany(() => Story, (story) => story.author)
  stories: Story[];

  @OneToMany(
    () => TranslationTask,
    (translationTask) => translationTask.translator
  )
  translationTasks: TranslationTask[];

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  userProfile: UserProfile;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;
}
