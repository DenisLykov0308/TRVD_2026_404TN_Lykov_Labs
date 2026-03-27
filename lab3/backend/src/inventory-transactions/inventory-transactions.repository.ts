import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryTransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    product: true,
    creator: true,
  };

  findAll(product_id?: number) {
    return this.prisma.inventoryTransaction.findMany({
      where: product_id ? { product_id } : undefined,
      include: this.includeRelations,
      orderBy: { transaction_date: 'desc' },
    });
  }
}