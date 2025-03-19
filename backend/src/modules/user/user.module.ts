import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { BullModule } from '@/common/bull/bull.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BullModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
