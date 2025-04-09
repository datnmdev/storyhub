import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetNotificationWithFilterDto } from './dtos/get-notification-with-filter.dto';
import { User } from '@/common/decorators/user.decorator';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { DeleteNotificationByIdDto } from './dtos/delete-notification-by-id.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/filter')
  getNotificationWithFilter(
    @User('id') userId: number,
    @Query() getNotificationWithFilterDto: GetNotificationWithFilterDto
  ) {
    return this.notificationService.getNotificationWithFilter(
      userId,
      getNotificationWithFilterDto
    );
  }

  @Put('/')
  updateNotification(
    @User('id') userId: number,
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationService.updateNotification(
      userId,
      updateNotificationDto
    );
  }

  @Delete()
  deleteNotificationById(
    @User('id') userId: number,
    @Query() deleteNotificationByIdDto: DeleteNotificationByIdDto
  ) {
    return this.notificationService.deleteNotificationById(
      userId,
      deleteNotificationByIdDto.id
    );
  }

  @Delete('/delete-all')
  deleteAllNotification(@User('id') userId: number) {
    return this.notificationService.deleteAllNotification(userId);
  }
}
