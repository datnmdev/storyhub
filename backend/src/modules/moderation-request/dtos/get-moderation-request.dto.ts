import { Pagination } from '@/common/class/pagination.class';
import { ModerationRequestStatus } from '@/common/constants/moderation-request.constants';
import { JsonToObject } from '@/common/decorators/transform.decorator';
import {
  ArrayElementsIn,
  IsOrderBy,
} from '@/common/decorators/validation.decorator';
import { OrderBy } from '@/common/types/typeorm.type';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class GetModerationRequestReqDto extends Pagination {
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
  chapterId?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  authorId?: number;

  @JsonToObject<number[]>([ModerationRequestStatus.PENDING])
  @IsOptional()
  @IsArray()
  @ArrayElementsIn([
    ModerationRequestStatus.PENDING,
    ModerationRequestStatus.APPROVED,
    ModerationRequestStatus.REJECTED,
  ])
  status: number[] = [ModerationRequestStatus.PENDING];

  @JsonToObject<OrderBy>([['createdAt', 'DESC']])
  @IsOptional()
  @IsOrderBy(['createdAt', 'id'])
  orderBy: OrderBy;
}
