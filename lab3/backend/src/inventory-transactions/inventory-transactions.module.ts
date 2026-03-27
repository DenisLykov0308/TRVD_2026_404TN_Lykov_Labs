import { Module } from '@nestjs/common';
import { InventoryTransactionsController } from './inventory-transactions.controller';
import { InventoryTransactionsRepository } from './inventory-transactions.repository';
import { InventoryTransactionsService } from './inventory-transactions.service';

@Module({
  controllers: [InventoryTransactionsController],
  providers: [InventoryTransactionsRepository, InventoryTransactionsService],
  exports: [InventoryTransactionsRepository, InventoryTransactionsService],
})
export class InventoryTransactionsModule {}
