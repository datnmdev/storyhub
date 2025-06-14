import { Pagination } from '@/common/class/pagination.class';
import { NotificationStatus } from '@/common/constants/notification.constants';
import { JsonToObject } from '@/common/decorators/transform.decorator';
import {
  ArrayElementsIn,
  IsOrderBy,
} from '@/common/decorators/validation.decorator';
import { OrderBy } from '@/common/types/typeorm.type';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class GetNotificationWithFilterDto extends Pagination {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  notificationId?: number;

  @JsonToObject<string[]>([
    NotificationStatus.CREATED,
    NotificationStatus.SENT,
    NotificationStatus.VIEWED,
  ])
  @IsOptional()
  @IsArray()
  @ArrayElementsIn([
    NotificationStatus.CREATED,
    NotificationStatus.SENT,
    NotificationStatus.VIEWED,
  ])
  status: NotificationStatus[];

  @JsonToObject<OrderBy>([['createdAt', 'DESC']])
  @IsOptional()
  @IsOrderBy(['createdAt', 'updatedAt'])
  orderBy: OrderBy;
}
