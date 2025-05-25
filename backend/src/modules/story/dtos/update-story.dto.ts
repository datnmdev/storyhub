import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStoryParamDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  storyId: number;
}

export class UpdateStoryBodyDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  coverImage: string;

  @IsOptional()
  @IsString()
  notes: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  countryId: number;
}
