import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Brackets, Repository } from 'typeorm';
import { GetCountriesDto } from './dtos/get-countries.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>
  ) {}

  getCountries(getCountriesDto: GetCountriesDto) {
    const qb = this.countryRepository
      .createQueryBuilder("country")
      .where(new Brackets(qb => {
        if (getCountriesDto.id) {
          qb.where("country.id = :id", {
            id: getCountriesDto.id
          })
        }
      }))
      .andWhere(new Brackets(qb => {
        if (getCountriesDto.name) {
          qb.where("country.name = :name", {
            name: getCountriesDto.name
          })
        }
      }))
    qb.take(getCountriesDto.limit)
    qb.skip((getCountriesDto.page - 1) * getCountriesDto.limit);
    return qb.getManyAndCount();
  }
}
