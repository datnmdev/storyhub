import { StoryType } from '@/common/constants/story.constants';
import { OneOf } from '@/common/decorators/validation.decorator';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UploadStoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  alias: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  coverImage: string;

  @IsNotEmpty()
  @IsString()
  @OneOf([StoryType.NOVEL, StoryType.COMIC])
  type: StoryType;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  genres: number[];

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsOptional()
  @IsString()
  notes: string;
}
