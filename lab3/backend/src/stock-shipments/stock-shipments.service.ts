import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { decimalToNumber } from '../common/mappers/decimal.util';
import { CustomersRepository } from '../customers/customers.repository';
import { ProductsRepository } from '../products/products.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import { CreateStockShipmentDto } from './dto/create-stock-shipment.dto';
import { StockShipmentResponseDto } from './dto/stock-shipment-response.dto';
import { StockShipmentsRepository } from './stock-shipments.repository';

type ShipmentDetails = {
  id: number;
  shipment_number: string;
  shipment_date: Date;
  status: string;
  total_amount: any;
  comment: string | null;
  customer: { id: number; name: string };
  creator: { id: number; email: string; full_name: string };
  items: Array<{
    id: number;
    quantity: number;
    unit_price: any;
    line_total: any;
    product: { id: number; name: string; sku: string };
  }>;
};

@Injectable()
export class StockShipmentsService {
  constructor(
    private readonly stockShipmentsRepository: StockShipmentsRepository,
    private readonly customersRepository: CustomersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<StockShipmentResponseDto[]> {
    const shipments = await this.stockShipmentsRepository.findAll();
    return shipments.map((shipment: ShipmentDetails) => this.toDto(shipment));
  }

  async findOne(id: number): Promise<StockShipmentResponseDto> {
    const shipment = await this.stockShipmentsRepository.findById(id);
    if (!shipment) {
      throw new NotFoundException('Документ відвантаження не знайдено.');
    }

    return this.toDto(shipment as ShipmentDetails);
  }

  async create(dto: CreateStockShipmentDto): Promise<StockShipmentResponseDto> {
    await this.ensureRelations(dto.customer_id, dto.created_by, dto.items.map((item) => item.product_id));

    const existingShipment = await this.stockShipmentsRepository.findByShipmentNumber(dto.shipment_number);
    if (existingShipment) {
      throw new BadRequestException('Документ відвантаження з таким номером вже існує.');
    }

    const totalAmount = dto.items.reduce(
      (sum, item) => sum.plus(new Decimal(item.unit_price).mul(item.quantity)),
      new Decimal(0),
    );

    const shipment = await this.prisma.$transaction(async (tx: any) => {
      for (const item of dto.items) {
        const product = await tx.product.findUnique({ where: { id: item.product_id } });
        if (!product) {
          throw new NotFoundException(`Товар з id=${item.product_id} не знайдено.`);
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(`Недостатній залишок товару ${product.name}.`);
        }
      }

      const createdShipment = await this.stockShipmentsRepository.create(tx, {
        shipment_number: dto.shipment_number,
        customer_id: dto.customer_id,
        created_by: dto.created_by,
        shipment_date: new Date(dto.shipment_date),
        status: dto.status ?? 'COMPLETED',
        total_amount: totalAmount,
        comment: dto.comment,
      });

      for (const item of dto.items) {
        const lineTotal = new Decimal(item.unit_price).mul(item.quantity);

        await this.stockShipmentsRepository.createItem(tx, {
          shipment_id: createdShipment.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: lineTotal,
        });

        await tx.product.update({
          where: { id: item.product_id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            product_id: item.product_id,
            transaction_type: 'OUT',
            quantity: item.quantity,
            reference_type: 'stock_shipment',
            reference_id: createdShipment.id,
            created_by: dto.created_by,
            transaction_date: new Date(dto.shipment_date),
            comment: dto.comment ?? 'Відвантаження товару',
          },
        });
      }

      return tx.stockShipment.findUniqueOrThrow({
        where: { id: createdShipment.id },
        include: {
          customer: true,
          creator: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return this.toDto(shipment as ShipmentDetails);
  }

  private async ensureRelations(customer_id: number, created_by: number, productIds: number[]) {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new NotFoundException('Клієнта не знайдено.');
    }

    const user = await this.usersRepository.findById(created_by);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено.');
    }

    for (const productId of productIds) {
      const product = await this.productsRepository.findById(productId);
      if (!product) {
        throw new NotFoundException(`Товар з id=${productId} не знайдено.`);
      }
    }
  }

  private toDto(shipment: ShipmentDetails): StockShipmentResponseDto {
    return {
      id: shipment.id,
      shipment_number: shipment.shipment_number,
      shipment_date: shipment.shipment_date,
      status: shipment.status,
      total_amount: decimalToNumber(shipment.total_amount),
      comment: shipment.comment,
      customer: {
        id: shipment.customer.id,
        name: shipment.customer.name,
      },
      created_by: {
        id: shipment.creator.id,
        email: shipment.creator.email,
        full_name: shipment.creator.full_name,
      },
      items: shipment.items.map((item: ShipmentDetails['items'][number]) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
        },
        quantity: item.quantity,
        unit_price: decimalToNumber(item.unit_price),
        line_total: decimalToNumber(item.line_total),
      })),
    };
  }
}