import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('wallet', { schema: 'storyhub' })
export class Wallet {
  @Column({ primary: true, type: 'int', name: 'id' })
  id: number;

  @Column('decimal', {
    name: 'balance',
    precision: 18,
    scale: 0,
    default: () => "'0'",
  })
  balance: string;

  @OneToOne(() => User, (user) => user.wallet, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  user: User;
}
