import { OneOf } from '@/common/decorators/validation.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUploadUrlDto {
  @IsNotEmpty()
  @IsString()
  @OneOf(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'])
  fileType: string;
}
