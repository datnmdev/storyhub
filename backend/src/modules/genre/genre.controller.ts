import { Controller, Get, Query } from '@nestjs/common';
import { GetGenreWithFilterDto } from './dto/get-genre-with-filter.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('filter')
  getGenreWithFilter(@Query() getGenreWithFilterDto: GetGenreWithFilterDto) {
    return this.genreService.getGenreWithFilter(getGenreWithFilterDto);
  }
}
