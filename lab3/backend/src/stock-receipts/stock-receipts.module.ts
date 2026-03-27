import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { UsersModule } from '../users/users.module';
import { StockReceiptsController } from './stock-receipts.controller';
import { StockReceiptsRepository } from './stock-receipts.repository';
import { StockReceiptsService } from './stock-receipts.service';

@Module({
  imports: [SuppliersModule, UsersModule, ProductsModule],
  controllers: [StockReceiptsController],
  providers: [StockReceiptsRepository, StockReceiptsService],
})
export class StockReceiptsModule {}
