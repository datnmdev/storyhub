import { Country } from '@/modules/country/entities/country.entity';
import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Index('FK_userProfile_country_idx', ['countryId'], {})
@Entity('user_profile', { schema: 'storyhub' })
export class UserProfile {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('date', { name: 'dob', nullable: true })
  dob: string | null;

  @Column('int', { name: 'gender', nullable: true })
  gender: number | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Column('longtext', { name: 'avatar', nullable: true })
  avatar: string | null;

  @Column('int', { name: 'country_id', nullable: true })
  countryId: number | null;

  @ManyToOne(() => Country, (country) => country.userProfiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'id' }])
  country: Country;

  @OneToOne(() => User, (user) => user.userProfile, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  user: User;
}
