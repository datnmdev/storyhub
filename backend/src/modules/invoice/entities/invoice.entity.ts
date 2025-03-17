import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Chapter } from '../../chapter/entities/chapter.entity';
import { User } from '../../user/entities/user.entity';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('FK_invoice_chapter_idx', ['chapterId'], {})
@Index('FK_invoice_reader_idx', ['readerId'], {})
@Entity('invoice', { schema: 'storyhub' })
export class Invoice {
  @Generated('increment')
  @Column({ type: 'int', name: 'id', unique: true })
  id: number;

  @Column('int', { primary: true, name: 'reader_id' })
  readerId: number;

  @Column('int', { primary: true, name: 'chapter_id' })
  chapterId: number;

  @Column('decimal', { name: 'total_amount', precision: 18, scale: 0 })
  totalAmount: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Chapter, (chapter) => chapter.invoices, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
  chapter: Chapter;

  @ManyToOne(() => User, (user) => user.invoices, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
  reader: User;
}
