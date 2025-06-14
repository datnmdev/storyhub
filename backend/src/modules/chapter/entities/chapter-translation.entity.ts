import { Chapter } from '@/modules/chapter/entities/chapter.entity';
import { Country } from '@/modules/country/entities/country.entity';
import { History } from '@/modules/history/entities/history.entity';
import { ImageContent } from '@/modules/chapter/entities/image-content.entity';
import { TextContent } from '@/modules/chapter/entities/text-content.entity';
import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('FK_chapterTranslation_country_idx', ['countryId'], {})
@Index('FK_chapterTranslation_translator_idx', ['translatorId'], {})
@Entity('chapter_translation', { schema: 'storyhub' })
export class ChapterTranslation {
  @Generated('increment')
  @Column({ type: 'int', name: 'id', unique: true })
  id: number;

  @Column('int', { primary: true, name: 'chapter_id' })
  chapterId: number;

  @Column('int', { primary: true, name: 'country_id' })
  countryId: number;

  @Column('int', {
    name: 'translator_id',
    nullable: true,
    comment:
      'translator_id = NULL thì điều này có nghĩa là nó là của tác giả (bản gốc)',
  })
  translatorId: number | null;

  @ManyToOne(() => Chapter, (chapter) => chapter.chapterTranslations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
  chapter: Chapter;

  @ManyToOne(() => Country, (country) => country.chapterTranslations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => User, (user) => user.chapterTranslations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'translator_id', referencedColumnName: 'id' }])
  translator: User;

  @OneToMany(() => History, (history) => history.chapterTranslation)
  histories: History[];

  @OneToMany(
    () => ImageContent,
    (imageContent) => imageContent.chapterTranslation
  )
  imageContents: ImageContent[];

  @OneToOne(() => TextContent, (textContent) => textContent.chapterTranslation)
  textContent: TextContent;
}
