import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowDetail } from './entities/follow-detail.entity';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowDetail])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
