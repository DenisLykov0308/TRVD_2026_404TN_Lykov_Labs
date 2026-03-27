import { Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { StockShipmentsController } from './stock-shipments.controller';
import { StockShipmentsRepository } from './stock-shipments.repository';
import { StockShipmentsService } from './stock-shipments.service';

@Module({
  imports: [CustomersModule, UsersModule, ProductsModule],
  controllers: [StockShipmentsController],
  providers: [StockShipmentsRepository, StockShipmentsService],
})
export class StockShipmentsModule {}
