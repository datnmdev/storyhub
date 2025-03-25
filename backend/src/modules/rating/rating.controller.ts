import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetRatingCountDto } from './dto/get-rating-count.dto';
import { GetRatingDto } from './dto/get-rating.dto';
import { RatingService } from './rating.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { User } from '@/common/decorators/user.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/constants/user.constants';
import { GetRatingSummaryDto } from './dto/get-rating-summary.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  getRating(@User('id') userId: number, @Query() getRatingDto: GetRatingDto) {
    return this.ratingService.getRating(userId, getRatingDto.storyId);
  }

  @Get('count')
  getRatingCount(@Query() getRatingCountDto: GetRatingCountDto) {
    return this.ratingService.getRatingCount(getRatingCountDto.storyId);
  }

  @Get('summary')
  getRatingSummary(@Query() getRatingDto: GetRatingSummaryDto) {
    return this.ratingService.getRatingSummary(getRatingDto.storyId);
  }

  @Post()
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  createRating(
    @User('id') userId: number,
    @Body() createRatingDto: CreateRatingDto
  ) {
    return this.ratingService.create(userId, createRatingDto);
  }

  @Put()
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  updateRating(
    @User('id') userId: number,
    @Body() updateRatingDto: UpdateRatingDto
  ) {
    return this.ratingService.update(userId, updateRatingDto);
  }
}
