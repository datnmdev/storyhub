import { IsOptional } from 'class-validator';

export class GetDataDto {
  @IsOptional()
  encoded: string;

  @IsOptional()
  hash: string;
}
