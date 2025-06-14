import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetCurrentPriceDto } from './dtos/get-current-price.dto';
import { PriceService } from './price.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreatePriceDto } from './dtos/create-price.dto';
import { User } from '@/common/decorators/user.decorator';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('current')
  getCurrentPrice(@Query() getCurrrentPriceDto: GetCurrentPriceDto) {
    return this.priceService.getCurrentPrice(getCurrrentPriceDto.storyId);
  }

  @Post()
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  createPrice(
    @User('id') authorId: number,
    @Body() createPriceDto: CreatePriceDto
  ) {
    return this.priceService.createPrice(
      authorId,
      createPriceDto.storyId,
      createPriceDto.amount
    );
  }
}
