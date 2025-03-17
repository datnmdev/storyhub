import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ChapterTranslation } from '@/modules/chapter-translation/entities/chapter-translation.entity';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('FK_history_reader_idx', ['readerId'], {})
@Index('FK_history_chapterTranslation_idx', ['chapterTranslationId'], {})
@Entity('history', { schema: 'storyhub' })
export class History {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'position' })
  position: string;

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

  @Column('int', { name: 'reader_id' })
  readerId: number;

  @Column('int', { name: 'chapter_translation_id' })
  chapterTranslationId: number;

  @ManyToOne(
    () => ChapterTranslation,
    (chapterTranslation) => chapterTranslation.histories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'chapter_translation_id', referencedColumnName: 'id' }])
  chapterTranslation: ChapterTranslation;

  @ManyToOne(() => User, (user) => user.histories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
  reader: User;
}
