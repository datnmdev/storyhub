import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateAliasBodyDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  alias: string[];
}

export class UpdateAliasQueryDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  storyId: number;
}
