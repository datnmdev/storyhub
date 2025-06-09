import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateModerationRequestReqDto {
  @IsNotEmpty()
  @IsInt()
  chapterId: number;
}
