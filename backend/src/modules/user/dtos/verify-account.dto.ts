import { IsNotEmpty, IsNumber, IsNumberString, Length } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  otp: string;

  @IsNotEmpty()
  @IsNumber()
  accountId: number;
}
