import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { InventoryTransactionsModule } from './inventory-transactions/inventory-transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { RolesModule } from './roles/roles.module';
import { StockReceiptsModule } from './stock-receipts/stock-receipts.module';
import { StockShipmentsModule } from './stock-shipments/stock-shipments.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { UnitsModule } from './units/units.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RolesModule,
    UsersModule,
    CategoriesModule,
    SuppliersModule,
    UnitsModule,
    CustomersModule,
    ProductsModule,
    StockReceiptsModule,
    StockShipmentsModule,
    InventoryTransactionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
