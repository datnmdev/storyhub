import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateGenresParamDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  storyId: number;
}

export class UpdateGenresBodyDto {
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  genres: number[];
}
