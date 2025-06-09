import { ModerationRequestStatus } from '@/common/constants/moderation-request.constants';
import { OneOf } from '@/common/decorators/validation.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateModerationRequestReqDto {
  @IsOptional()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @OneOf([ModerationRequestStatus.APPROVED, ModerationRequestStatus.REJECTED])
  status: number;
}
