import { Transform, Type } from 'class-transformer';
import {
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

export class UpdateChapterParamDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  chapterId: number;
}

export class UpdateChapterBodyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  order: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextContentDto)
  textContent: TextContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageContentDto)
  imageContents: ImageContentDto[];
}
