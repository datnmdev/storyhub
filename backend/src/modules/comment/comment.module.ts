import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { BullModule } from '@/common/bull/bull.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), BullModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
