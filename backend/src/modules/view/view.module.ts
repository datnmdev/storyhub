import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from './entities/view.entity';
import { ViewService } from './view.service';

@Module({
  imports: [TypeOrmModule.forFeature([View])],
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}
