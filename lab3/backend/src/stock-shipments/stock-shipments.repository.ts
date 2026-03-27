import { Decimal } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type DbClient = any;

@Injectable()
export class StockShipmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    customer: true,
    creator: true,
    items: {
      include: {
        product: true,
      },
    },
  };

  findAll() {
    return this.prisma.stockShipment.findMany({
      include: this.includeRelations,
      orderBy: { shipment_date: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.stockShipment.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  findByShipmentNumber(shipment_number: string) {
    return this.prisma.stockShipment.findUnique({ where: { shipment_number } });
  }

  create(client: DbClient, data: {
    shipment_number: string;
    customer_id: number;
    created_by: number;
    shipment_date: Date;
    status: string;
    total_amount: Decimal;
    comment?: string;
  }) {
    return client.stockShipment.create({ data });
  }

  createItem(client: DbClient, data: {
    shipment_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    line_total: Decimal;
  }) {
    return client.stockShipmentItem.create({ data });
  }
}