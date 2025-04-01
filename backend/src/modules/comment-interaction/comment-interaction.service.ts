import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InteractionType } from '@/common/constants/interaction.type';
import { CommentInteraction } from './entities/comment-interaction.entity';
import { GetInteractionCountDto } from './dtos/get-interaction-count.dto';
import { CreateInteractionDto } from './dtos/create-interaction.dto';
import { UpdateInteractionDto } from './dtos/update-interaction.dto';

@Injectable()
export class CommentInteractionService {
  constructor(
    @InjectRepository(CommentInteraction)
    private readonly commentInteractionRepository: Repository<CommentInteraction>
  ) {}

  getInteraction(readerId: number, commentId: number) {
    return this.commentInteractionRepository.findOne({
      where: {
        readerId,
        commentId,
      },
    });
  }

  async getInteractionCount(getInteractionCountDto: GetInteractionCountDto) {
    return {
      likeCount: await this.commentInteractionRepository
        .createQueryBuilder('commentInteraction')
        .andWhere('commentInteraction.comment_id = :commentId', {
          commentId: getInteractionCountDto.commentId,
        })
        .andWhere('commentInteraction.interaction_type = :interactionType', {
          interactionType: InteractionType.LIKE,
        })
        .getCount(),
      dislikeCount: await this.commentInteractionRepository
        .createQueryBuilder('commentInteraction')
        .andWhere('commentInteraction.comment_id = :commentId', {
          commentId: getInteractionCountDto.commentId,
        })
        .andWhere('commentInteraction.interaction_type = :interactionType', {
          interactionType: InteractionType.DISLIKE,
        })
        .getCount(),
    };
  }

  createInteraction(
    readerId: number,
    createInteractionDto: CreateInteractionDto
  ) {
    return this.commentInteractionRepository.save({
      readerId,
      commentId: createInteractionDto.commentId,
      interactionType: createInteractionDto.interactionType,
    });
  }

  deleteInteraction(readerId: number, commentId: number) {
    return this.commentInteractionRepository.delete({
      readerId,
      commentId,
    });
  }
}
