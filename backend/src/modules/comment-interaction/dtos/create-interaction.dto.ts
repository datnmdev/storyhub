import { InteractionType } from '@/common/constants/interaction.type';
import { OneOf } from '@/common/decorators/validation.decorator';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsNotEmpty()
  @IsInt()
  commentId: number;

  @IsNotEmpty()
  @IsString()
  @OneOf([InteractionType.LIKE, InteractionType.DISLIKE])
  interactionType: InteractionType;
}
