import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@/common/decorators/user.decorator';
import { CommentService } from './comment.service';
import { GetCommentWithFilterDto } from './dtos/get-comment-with-filter.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DeleteCommentGuard, UpdateCommentGuard } from './comment.guard';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { DeleteCommentDto } from './dtos/delete-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getCommentWithFilter(
    @Query() getCommentWithFilterDto: GetCommentWithFilterDto
  ) {
    return this.commentService.getCommentWithFilter(getCommentWithFilterDto);
  }

  @Post()
  createComment(
    @User('id') userId: number,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.commentService.createComment(userId, createCommentDto);
  }

  @Put()
  @UseGuards(UpdateCommentGuard)
  updateComment(@Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(
      updateCommentDto.id,
      updateCommentDto.content
    );
  }

  @Delete(':id')
  @UseGuards(DeleteCommentGuard)
  deleteComment(@Param() deleteCommentDto: DeleteCommentDto) {
    return this.commentService.deleteComment(deleteCommentDto.id);
  }
}
