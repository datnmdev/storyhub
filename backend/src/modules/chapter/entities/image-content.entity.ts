import { ChapterTranslation } from '@/modules/chapter-translation/entities/chapter-translation.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index(
  'FK_imageTranslation_chapterTranslation_idx',
  ['chapterTranslationId'],
  {}
)
@Entity('image_content', { schema: 'storyhub' })
export class ImageContent {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'order' })
  order: number;

  @Column('text', { name: 'path' })
  path: string;

  @Column('int', { name: 'chapter_translation_id' })
  chapterTranslationId: number;

  @ManyToOne(
    () => ChapterTranslation,
    (chapterTranslation) => chapterTranslation.imageContents,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'chapter_translation_id', referencedColumnName: 'id' }])
  chapterTranslation: ChapterTranslation;
}
