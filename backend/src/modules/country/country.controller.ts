import { Controller, Get, Query } from '@nestjs/common';
import { CountryService } from './country.service';
import { GetCountriesDto } from './dtos/get-countries.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('/')
  getAllCountries(@Query() getCountriesDto: GetCountriesDto) {
    return this.countryService.getCountries(getCountriesDto);
  }
}
