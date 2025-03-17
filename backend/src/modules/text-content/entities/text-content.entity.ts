import { ChapterTranslation } from '@/modules/chapter-translation/entities/chapter-translation.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

@Index(
  'FK_textTranslation_chapterTranslation_idx',
  ['chapterTranslationId'],
  {}
)
@Entity('text_content', { schema: 'storyhub' })
export class TextContent {
  @Column('int', { primary: true, name: 'chapter_translation_id' })
  chapterTranslationId: number;

  @Column('longtext', { name: 'content' })
  content: string;

  @OneToOne(
    () => ChapterTranslation,
    (chapterTranslation) => chapterTranslation.textContent,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'chapter_translation_id', referencedColumnName: 'id' }])
  chapterTranslation: ChapterTranslation;
}
