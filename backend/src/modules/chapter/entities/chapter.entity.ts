import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from '../../story/entities/story.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { ModerationRequest } from '../../moderation-request/entities/moderation-request';
import { TranslationTask } from '../../translation-task/entities/translation-task.entity';
import { View } from '../../view/entities/view.entity';
import { ChapterTranslation } from '@/modules/chapter-translation/entities/chapter-translation.entity';
import { Comment } from '@/modules/comment/entities/comment.entity';

@Index('FK_chapter_story_idx', ['storyId'], {})
@Index('FTI_name', ['name'], { fulltext: true })
@Entity('chapter', { schema: 'storyhub' })
export class Chapter {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'order' })
  order: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('enum', {
    name: 'status',
    enum: ['unreleased', 'pending_release', 'releasing', 'deleted'],
  })
  status: 'unreleased' | 'pending_release' | 'releasing' | 'deleted';

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

  @Column('int', { name: 'story_id' })
  storyId: number;

  @ManyToOne(() => Story, (story) => story.chapters, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
  story: Story;

  @OneToMany(
    () => ChapterTranslation,
    (chapterTranslation) => chapterTranslation.chapter
  )
  chapterTranslations: ChapterTranslation[];

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments: Comment[];

  @OneToMany(() => Invoice, (invoice) => invoice.chapter)
  invoices: Invoice[];

  @OneToMany(
    () => ModerationRequest,
    (moderationRequest) => moderationRequest.chapter
  )
  moderationRequests: ModerationRequest[];

  @OneToMany(
    () => TranslationTask,
    (translationTask) => translationTask.chapter
  )
  translationTasks: TranslationTask[];

  @OneToMany(() => View, (view) => view.chapter)
  views: View[];
}
