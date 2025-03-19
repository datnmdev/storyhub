import { Role } from '@/common/constants/user.constants';
import { Gender } from '@/common/constants/user.constants';
import { OneOf } from '@/common/decorators/validation.decorator';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @OneOf([Role.READER, Role.AUTHOR])
  type: Role;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @Transform(({ value }) => {
    const momentDate = moment(value, 'YYYY-MM-DD', true);
    if (momentDate.isValid()) {
      return momentDate.toDate();
    }
    return value;
  })
  @IsNotEmpty()
  @IsDate()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  @OneOf([Gender.MALE, Gender.FEMALE, Gender.ORTHER])
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10,11}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  password: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  countryId: number;
}
