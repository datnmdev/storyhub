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
  type: string[] = [StoryType.NOVEL, StoryType.COMIC];

  @JsonToObject<string[]>([StoryStatus.RELEASING, StoryStatus.COMPLETED])
  @IsOptional()
  @IsArray()
  @ArrayElementsIn([StoryStatus.RELEASING, StoryStatus.COMPLETED])
  status: string[] = [StoryStatus.RELEASING, StoryStatus.COMPLETED];

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

  @JsonToObject<OrderBy>([['updatedAt', 'DESC']])
  @IsOptional()
  @IsOrderBy(['createdAt', 'updatedAt', 'id'])
  orderBy: OrderBy;
}
