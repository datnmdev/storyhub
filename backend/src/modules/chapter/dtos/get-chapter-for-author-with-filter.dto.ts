import { Pagination } from '@/common/class/pagination.class';
import { ChapterStatus } from '@/common/constants/chapter.constants';
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

export class GetChapterForAuthorWithFilterDto extends Pagination {
  @IsOptional()
  @IsString()
  keyword: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  id?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @JsonToObject<string[]>([
    ChapterStatus.UNRELEASED,
    ChapterStatus.PENDING_APPROVAL,
    ChapterStatus.RELEASING,
  ])
  @IsOptional()
  @IsArray()
  @ArrayElementsIn([
    ChapterStatus.UNRELEASED,
    ChapterStatus.PENDING_APPROVAL,
    ChapterStatus.RELEASING,
  ])
  status: string[] = [
    ChapterStatus.UNRELEASED,
    ChapterStatus.PENDING_APPROVAL,
    ChapterStatus.RELEASING,
  ];

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  storyId?: number;

  @JsonToObject<OrderBy>([
    ['order', 'DESC'],
    ['createdAt', 'DESC'],
    ['updatedAt', 'DESC'],
    ['id', 'DESC'],
  ])
  @IsOptional()
  @IsOrderBy(['createdAt', 'updatedAt', 'order', 'id'])
  orderBy: OrderBy;
}
