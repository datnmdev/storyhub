import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentInteraction } from './entities/comment-interaction.entity';
import { CommentInteractionController } from './comment-interaction.controller';
import { CommentInteractionService } from './comment-interaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentInteraction])],
  controllers: [CommentInteractionController],
  providers: [CommentInteractionService],
})
export class CommentInteractionModule {}
