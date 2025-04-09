import { NotificationStatus } from '@/common/constants/notification.constants';
import { OneOf } from '@/common/decorators/validation.decorator';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  notificationId: number;

  @IsNotEmpty()
  @IsString()
  @OneOf([NotificationStatus.VIEWED])
  status: NotificationStatus;
}
