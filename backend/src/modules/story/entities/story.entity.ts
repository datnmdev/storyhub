import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alias } from '../../alias/entities/alias.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';
import { Price } from '../../price/entities/price.entity';
import { RatingDetail } from '../../rating/entities/rating-detail.entity';
import { User } from '../../user/entities/user.entity';
import { FollowDetail } from '@/modules/follow/entities/follow-detail.entity';
import { Genre } from '@/modules/genre/entities/genre.entity';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { Country } from '@/modules/country/entities/country.entity';

@Index('FK_story_country_idx', ['countryId'], {})
@Index('FK_story_author_idx', ['authorId'], {})
@Index('FTI_title', ['title'], { fulltext: true })
@Entity('story', { schema: 'storyhub' })
export class Story {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'type',
    enum: ['novel', 'comic'],
  })
  type: 'novel' | 'comic';

  @Column('text', { name: 'title' })
  title: string;

  @Column('longtext', { name: 'description' })
  description: string;

  @Column('longtext', { name: 'notes', nullable: true })
  notes: string | null;

  @Column('longtext', { name: 'cover_image' })
  coverImage: string;

  @Column('enum', {
    name: 'status',
    enum: ['releasing', 'paused', 'completed', 'deleted'],
  })
  status: 'releasing' | 'paused' | 'completed' | 'deleted';

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

  @Column('int', { name: 'country_id' })
  countryId: number;

  @Column('int', { name: 'author_id' })
  authorId: number;

  @OneToMany(() => Alias, (alias) => alias.story)
  aliases: Alias[];

  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[];

  @OneToMany(() => Comment, (comment) => comment.story)
  comments: Comment[];

  @OneToMany(() => FollowDetail, (followDetail) => followDetail.story)
  followDetails: FollowDetail[];

  @ManyToMany(() => Genre, (genre) => genre.stories)
  genres: Genre[];

  @OneToMany(() => Price, (price) => price.story)
  prices: Price[];

  @OneToMany(() => RatingDetail, (ratingDetail) => ratingDetail.story)
  ratingDetails: RatingDetail[];

  @ManyToOne(() => User, (user) => user.stories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: User;

  @ManyToOne(() => Country, (country) => country.stories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'id' }])
  country: Country;
}
