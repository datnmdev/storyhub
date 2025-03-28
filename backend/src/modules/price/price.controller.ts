import { Controller, Get, Query } from '@nestjs/common';
import { GetCurrentPriceDto } from './dtos/get-current-price.dto';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('current')
  getCurrentPrice(@Query() getCurrrentPriceDto: GetCurrentPriceDto) {
    return this.priceService.getCurrentPrice(getCurrrentPriceDto.storyId);
  }
}
