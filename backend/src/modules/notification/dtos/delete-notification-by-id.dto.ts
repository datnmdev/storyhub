import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteNotificationByIdDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  id: number;
}
