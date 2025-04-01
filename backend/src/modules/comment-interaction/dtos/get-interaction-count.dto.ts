import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetInteractionCountDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  commentId: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  readerId: number;
}
