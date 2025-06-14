import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePriceDto {
  @IsNotEmpty()
  @IsInt()
  storyId: number;

  @IsNotEmpty()
  @IsString()
  amount: string;
}
