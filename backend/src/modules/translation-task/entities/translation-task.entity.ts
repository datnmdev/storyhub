import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from '../../chapter/entities/chapter.entity';
import { User } from '../../user/entities/user.entity';
import { Country } from '@/modules/country/entities/country.entity';

@Index('FK_translationTask_chapter_idx', ['chapterId'], {})
@Index('FK_translationTask_country_idx', ['countryId'], {})
@Index('FK_translationTask_translator_idx', ['translatorId'], {})
@Entity('translation_task', { schema: 'storyhub' })
export class TranslationTask {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', { name: 'assigned_date' })
  assignedDate: Date;

  @Column('enum', { name: 'status', enum: ['in_progress', 'completed'] })
  status: 'in_progress' | 'completed';

  @Column('text', { name: 'notes', nullable: true })
  notes: string | null;

  @Column('datetime', { name: 'completion_date', nullable: true })
  completionDate: Date | null;

  @Column('int', { name: 'chapter_id' })
  chapterId: number;

  @Column('int', { name: 'country_id' })
  countryId: number;

  @Column('int', { name: 'translator_id' })
  translatorId: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.translationTasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
  chapter: Chapter;

  @ManyToOne(() => Country, (country) => country.translationTasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => User, (user) => user.translationTasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'translator_id', referencedColumnName: 'id' }])
  translator: User;
}
