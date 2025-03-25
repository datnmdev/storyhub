import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ImageContent } from '../entities/image-content.entity';

export class GetChapterContentDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  chapterTranlationId: number;
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
  content: string;

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
  storyId: number;
}
