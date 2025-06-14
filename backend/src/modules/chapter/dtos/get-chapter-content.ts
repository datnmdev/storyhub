import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ImageContent } from '../entities/image-content.entity';
import { TextContent } from '../entities/text-content.entity';
import { History } from '@/modules/history/entities/history.entity';

export class GetChapterContentDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  chapterTranslationId: number;
}

@Exclude()
export class TextContentDto {
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
  text: TextContent;

  @Expose()
  history: History;

  @Expose()
  storyId: number;
}

@Exclude()
export class ImageContentDto {
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
  images: ImageContent[];

  @Expose()
  history: History;

  @Expose()
  storyId: number;
}
