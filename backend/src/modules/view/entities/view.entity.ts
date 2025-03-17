import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from '../../chapter/entities/chapter.entity';

@Index('FK_view_chapter_idx', ['chapterId'], {})
@Entity('view', { schema: 'storyhub' })
export class View {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('text', { name: 'visitor_id' })
  visitorId: string;

  @Column('int', { name: 'chapter_id' })
  chapterId: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.views, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
  chapter: Chapter;
}
