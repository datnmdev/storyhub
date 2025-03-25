import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { GetGenreWithFilterDto } from './dto/get-genre-with-filter.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>
  ) {}

  getGenreWithFilter(getGenreWithFilterDto: GetGenreWithFilterDto) {
    const qb = this.genreRepository
      .createQueryBuilder('genre')
      .where(
        new Brackets((qb) => {
          if (getGenreWithFilterDto.id) {
            qb.where('genre.id = :id', {
              id: getGenreWithFilterDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getGenreWithFilterDto.name) {
            qb.where('genre.name = :name', {
              name: getGenreWithFilterDto.name,
            });
          }
        })
      );
    qb.take(getGenreWithFilterDto.limit);
    qb.skip((getGenreWithFilterDto.page - 1) * getGenreWithFilterDto.limit);
    return qb.getManyAndCount();
  }
}
