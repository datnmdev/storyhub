import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('employee', { schema: 'storyhub' })
export class Employee {
  @PrimaryColumn('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'cccd', length: 12 })
  cccd: string;

  @Column('enum', { name: 'position', enum: ['moderator', 'translator'] })
  position: 'moderator' | 'translator';

  @Column('enum', { name: 'status', enum: ['working', 'resigned'] })
  status: 'working' | 'resigned';

  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @Column('date', { name: 'doj' })
  doj: string;

  @OneToOne(() => User, (user) => user.employee, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  user: User;
}
