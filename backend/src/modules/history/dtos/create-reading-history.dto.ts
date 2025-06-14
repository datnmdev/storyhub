import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsInt()
  chapterTranslationId: number;
}
