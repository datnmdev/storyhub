import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteHistoryByChapterTranslationIdDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  chapterTranslationId: number;
}
