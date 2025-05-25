import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ImageContentDto {
  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsNotEmpty()
  @IsString()
  path: string;
}

export class TextContentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UploadChapterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextContentDto)
  textContent: TextContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageContentDto)
  imageContents: ImageContentDto[];

  @IsNotEmpty()
  @IsInt()
  storyId: number;
}
