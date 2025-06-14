import { Module } from '@nestjs/common';
import { AliasService } from './alias.service';
import { AliasController } from './alias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alias } from './entities/alias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alias])],
  controllers: [AliasController],
  providers: [AliasService],
  exports: [AliasService],
})
export class AliasModule {}
