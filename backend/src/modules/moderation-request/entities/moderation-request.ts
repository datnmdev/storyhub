import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';
import { Notification } from '@/modules/notification/entities/notification.entity';

@Index('FK_moderationRequest_author_idx', ['authorId'], {})
@Index('FK_moderationRequest_moderator_idx', ['moderatorId'], {})
@Index('FK_moderationRequest_chapter_idx', ['chapterId'], {})
@Entity('moderation_request', { schema: 'storyhub' })
export class ModerationRequest {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('longtext', {
    name: 'reason',
    nullable: true,
    comment:
      'reason là lý do mà yêu cầu được gửi từ tác giả được duyệt hay không được duyệt bởi kiểm duyệt viên',
  })
  reason: string | null;

  @Column('int', {
    name: 'status',
    comment:
      '- status có các giá trị và ý nghĩa tương ứng như sau:\n+ 0: Chờ xử lý\n+ 1: Đã được duyệt\n+ 2: Không được duyệt',
  })
  status: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', { name: 'process_at', nullable: true })
  processAt: Date | null;

  @Column('int', { name: 'chapter_id' })
  chapterId: number;

  @Column('int', {
    name: 'author_id',
    comment: 'Người gửi yêu cầu ở đây là tác giả',
  })
  authorId: number;

  @Column('int', {
    name: 'moderator_id',
    comment: 'Người xử lý yêu cầu ở đây là kiểm duyệt viên',
    nullable: true,
  })
  moderatorId: number;

  @ManyToOne(() => User, (user) => user.moderationRequests, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: User;

  @ManyToOne(() => Chapter, (chapter) => chapter.moderationRequests, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
  chapter: Chapter;

  @ManyToOne(() => User, (user) => user.moderationRequests2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'moderator_id', referencedColumnName: 'id' }])
  moderator: User;

  @OneToMany(
    () => Notification,
    (notification) => notification.moderationRequest
  )
  notifications: Notification[];
}
