import { Story } from '@/modules/story/entities/story.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FTI_name', ['name'], { fulltext: true })
@Entity('genre', { schema: 'storyhub' })
export class Genre {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('longtext', { name: 'description', nullable: true })
  description: string | null;

  @ManyToMany(() => Story, (story) => story.genres)
  @JoinTable({
    name: 'genre_detail',
    joinColumns: [{ name: 'genre_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'story_id', referencedColumnName: 'id' }],
    schema: 'storyhub',
  })
  stories: Story[];
}
