import { Pagination } from '@/common/class/pagination.class';
import { StoryStatus, StoryType } from '@/common/constants/story.constants';
import { JsonToObject } from '@/common/decorators/transform.decorator';
import {
  ArrayElementsIn,
  IsOrderBy,
} from '@/common/decorators/validation.decorator';
import { OrderBy } from '@/common/types/typeorm.type';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetStoryWithFilterDto extends Pagination {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @JsonToObject<string[]>([StoryType.COMIC, StoryType.NOVEL])
  @IsOptional()
  @IsArray()
  @ArrayElementsIn([StoryType.NOVEL, StoryType.COMIC])
  type: string[];

  @JsonToObject<string[]>([StoryStatus.RELEASING, StoryStatus.COMPLETED])
  @IsOptional()
  @IsArray()
  @ArrayElementsIn([StoryStatus.RELEASING, StoryStatus.COMPLETED])
  status: string[];

  @Transform(({ value }) => Number(value))
  @IsOptional()
  countryId?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  authorId?: number;

  @JsonToObject()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  genres?: number[];

  @JsonToObject<OrderBy>([['updated_at', 'DESC']])
  @IsOptional()
  @IsOrderBy(['created_at', 'updated_at', 'id'])
  orderBy: OrderBy;
}
