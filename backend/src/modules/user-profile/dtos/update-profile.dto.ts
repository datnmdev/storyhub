import { Gender } from '@/common/constants/user.constants';
import { OneOf } from '@/common/decorators/validation.decorator';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name: string;

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  dob: Date;

  @IsOptional()
  @IsString()
  @OneOf([Gender.MALE, Gender.FEMALE, Gender.ORTHER])
  gender: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,11}$/)
  phone: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
