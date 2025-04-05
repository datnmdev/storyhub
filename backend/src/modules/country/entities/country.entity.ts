import { ChapterTranslation } from '@/modules/chapter/entities/chapter-translation.entity';
import { Story } from '@/modules/story/entities/story.entity';
import { TranslationTask } from '@/modules/translation-task/entities/translation-task.entity';
import { UserProfile } from '@/modules/user-profile/entities/user-profile.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FTI_name', ['name'], { fulltext: true })
@Entity('country', { schema: 'storyhub' })
export class Country {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;

  @OneToMany(
    () => ChapterTranslation,
    (chapterTranslation) => chapterTranslation.country
  )
  chapterTranslations: ChapterTranslation[];

  @OneToMany(() => Story, (story) => story.country)
  stories: Story[];

  @OneToMany(
    () => TranslationTask,
    (translationTask) => translationTask.country
  )
  translationTasks: TranslationTask[];

  @OneToMany(() => UserProfile, (userProfile) => userProfile.country)
  userProfiles: UserProfile[];
}
