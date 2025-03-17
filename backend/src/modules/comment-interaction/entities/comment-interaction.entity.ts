import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '@/modules/comment/entities/comment.entity';

@Index('FK_commentInteraction_comment_idx', ['commentId'], {})
@Index('FK_commentInteraction_reader_idx', ['readerId'], {})
@Entity('comment_interaction', { schema: 'storyhub' })
export class CommentInteraction {
  @Column('int', { primary: true, name: 'reader_id' })
  readerId: number;

  @Column('int', { primary: true, name: 'comment_id' })
  commentId: number;

  @Column('enum', {
    name: 'interactionType',
    enum: ['like', 'disllike'],
  })
  interactionType: 'like' | 'disllike';

  @ManyToOne(() => Comment, (comment) => comment.commentInteractions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentInteractions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
  reader: User;
}
