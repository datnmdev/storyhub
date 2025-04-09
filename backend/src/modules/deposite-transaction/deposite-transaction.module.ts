import { Module } from '@nestjs/common';
import { DepositeTransactionController } from './deposite-transaction.controller';
import { DepositeTransactionService } from './deposite-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositeTransaction } from './entities/deposite-transaction.entity';
import { WalletModule } from '../wallet/wallet.module';
import { BullModule } from '@/common/bull/bull.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositeTransaction]),
    WalletModule,
    BullModule,
  ],
  controllers: [DepositeTransactionController],
  providers: [DepositeTransactionService],
})
export class DepositeTransactionModule {}
