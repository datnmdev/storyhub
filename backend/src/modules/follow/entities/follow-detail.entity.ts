import { Story } from '@/modules/story/entities/story.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('FK_followDetail_story_idx', ['storyId'], {})
@Index('FK_followDetail_reader_idx', ['readerId'], {})
@Entity('follow_detail', { schema: 'storyhub' })
export class FollowDetail {
  @Column('int', { primary: true, name: 'reader_id' })
  readerId: number;

  @Column('int', { primary: true, name: 'story_id' })
  storyId: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.followDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
  reader: User;

  @ManyToOne(() => Story, (story) => story.followDetails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
  story: Story;
}
