import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    category: true,
    supplier: true,
    unit: true,
  };

  findAll(search?: string) {
    return this.prisma.product.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      include: this.includeRelations,
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  findBySku(sku: string) {
    return this.prisma.product.findUnique({
      where: { sku },
      include: this.includeRelations,
    });
  }

  create(data: {
    name: string;
    sku: string;
    description?: string;
    category_id: number;
    supplier_id: number;
    unit_id: number;
    price: number;
    quantity: number;
    min_quantity: number;
  }) {
    return this.prisma.product.create({
      data,
      include: this.includeRelations,
    });
  }

  update(
    id: number,
    data: Partial<{
      name: string;
      sku: string;
      description?: string;
      category_id: number;
      supplier_id: number;
      unit_id: number;
      price: number;
      quantity: number;
      min_quantity: number;
    }>,
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: this.includeRelations,
    });
  }

  async getDeleteDependencies(id: number) {
    const [receiptItems, shipmentItems, transactions] = await this.prisma.$transaction([
      this.prisma.stockReceiptItem.count({ where: { product_id: id } }),
      this.prisma.stockShipmentItem.count({ where: { product_id: id } }),
      this.prisma.inventoryTransaction.count({ where: { product_id: id } }),
    ]);

    return {
      receiptItems,
      shipmentItems,
      transactions,
    };
  }

  delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
      include: this.includeRelations,
    });
  }
}