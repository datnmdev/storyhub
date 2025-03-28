import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetRatingDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsInt()
  storyId: number;
}
