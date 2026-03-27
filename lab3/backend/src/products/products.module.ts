import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { UnitsModule } from '../units/units.module';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
  imports: [CategoriesModule, SuppliersModule, UnitsModule],
  controllers: [ProductsController],
  providers: [ProductsRepository, ProductsService],
  exports: [ProductsRepository, ProductsService],
})
export class ProductsModule {}
