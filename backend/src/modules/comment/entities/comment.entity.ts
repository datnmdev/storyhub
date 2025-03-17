import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { CommentInteraction } from '@/modules/comment-interaction/entities/comment-interaction.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_comment_reader_idx', ['readerId'], {})
@Index('FK_comment_commentparent_idx', ['parentId'], {})
@Index('FK_comment_story_idx', ['storyId'], {})
@Index('FK_comment_chapter_idx', ['chapterId'], {})
@Entity('comment', { schema: 'storyhub' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'type',
    enum: ['story_comment', 'chapter_comment'],
  })
  type: 'story_comment' | 'chapter_comment';

  @Column('longtext', { name: 'content' })
  content: string;

  @Column('int', { name: 'parent_id', nullable: true })
  parentId: number | null;

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

  @Column('int', { name: 'story_id', nullable: true })
  storyId: number | null;

  @Column('int', { name: 'chapter_id', nullable: true })
  chapterId: number | null;

  @Column('int', { name: 'reader_id' })
  readerId: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
  chapter: Chapter;

  @ManyToOne(() => Comment, (comment) => comment.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'parent_id', referencedColumnName: 'id' }])
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
  reader: User;

  @ManyToOne(() => Story, (story) => story.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
  story: Story;

  @OneToMany(
    () => CommentInteraction,
    (commentInteraction) => commentInteraction.comment
  )
  commentInteractions: CommentInteraction[];
}
