import { Pagination } from '@/common/class/pagination.class';
import { JsonToObject } from '@/common/decorators/transform.decorator';
import { IsOrderBy } from '@/common/decorators/validation.decorator';
import { OrderBy } from '@/common/types/typeorm.type';
import { Invoice } from '@/modules/invoice/entities/invoice.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetChapterWithFilterDto extends Pagination {
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

@Exclude()
export class ChapterInfoPublicDto {
  @Expose()
  id: number;

  @Expose()
  order: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  storyId: number;
}

@Exclude()
export class ChapterInfoPublicWithInvoiceRelationDto extends ChapterInfoPublicDto {
  @Expose()
  invoices: Invoice[];
}
