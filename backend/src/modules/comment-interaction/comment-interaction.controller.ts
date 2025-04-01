import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@/common/decorators/user.decorator';
import { CommentInteractionService } from './comment-interaction.service';
import { GetInteractionDto } from './dtos/get-interaction.dto';
import { GetInteractionCountDto } from './dtos/get-interaction-count.dto';
import { CreateInteractionDto } from './dtos/create-interaction.dto';
import { UpdateInteractionDto } from './dtos/update-interaction.dto';
import { DeleteInteractionDto } from './dtos/delete-interaction.dto';

@Controller('comment-interaction')
export class CommentInteractionController {
  constructor(private readonly interactionService: CommentInteractionService) {}

  @Get()
  getInteraction(
    @User('id') userId: number,
    @Query() getInteractionDto: GetInteractionDto
  ) {
    return this.interactionService.getInteraction(
      userId,
      getInteractionDto.commentId
    );
  }

  @Get('/count')
  getInteractionCount(@Query() getInteractionCountDto: GetInteractionCountDto) {
    return this.interactionService.getInteractionCount(getInteractionCountDto);
  }

  @Post()
  createInteraction(
    @User('id') userId: number,
    @Body() createInteractionDto: CreateInteractionDto
  ) {
    return this.interactionService.createInteraction(
      userId,
      createInteractionDto
    );
  }

  @Delete()
  deleteInteraction(
    @User('id') userId: number,
    @Query() deleteInteractionDto: DeleteInteractionDto
  ) {
    return this.interactionService.deleteInteraction(
      userId,
      deleteInteractionDto.commentId
    );
  }
}
