import { Decimal } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type DbClient = any;

@Injectable()
export class StockReceiptsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    supplier: true,
    creator: true,
    items: {
      include: {
        product: true,
      },
    },
  };

  findAll() {
    return this.prisma.stockReceipt.findMany({
      include: this.includeRelations,
      orderBy: { receipt_date: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.stockReceipt.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  findByReceiptNumber(receipt_number: string) {
    return this.prisma.stockReceipt.findUnique({ where: { receipt_number } });
  }

  create(client: DbClient, data: {
    receipt_number: string;
    supplier_id: number;
    created_by: number;
    receipt_date: Date;
    status: string;
    total_amount: Decimal;
    comment?: string;
  }) {
    return client.stockReceipt.create({ data });
  }

  createItem(client: DbClient, data: {
    receipt_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    line_total: Decimal;
  }) {
    return client.stockReceiptItem.create({ data });
  }
}