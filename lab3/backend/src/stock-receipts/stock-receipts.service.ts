import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { decimalToNumber } from '../common/mappers/decimal.util';
import { ProductsRepository } from '../products/products.repository';
import { PrismaService } from '../prisma/prisma.service';
import { SuppliersRepository } from '../suppliers/suppliers.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { StockReceiptResponseDto } from './dto/stock-receipt-response.dto';
import { StockReceiptsRepository } from './stock-receipts.repository';

type ReceiptDetails = {
  id: number;
  receipt_number: string;
  receipt_date: Date;
  status: string;
  total_amount: any;
  comment: string | null;
  supplier: { id: number; name: string };
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
export class StockReceiptsService {
  constructor(
    private readonly stockReceiptsRepository: StockReceiptsRepository,
    private readonly suppliersRepository: SuppliersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<StockReceiptResponseDto[]> {
    const receipts = await this.stockReceiptsRepository.findAll();
    return receipts.map((receipt: ReceiptDetails) => this.toDto(receipt));
  }

  async findOne(id: number): Promise<StockReceiptResponseDto> {
    const receipt = await this.stockReceiptsRepository.findById(id);
    if (!receipt) {
      throw new NotFoundException('Документ надходження не знайдено.');
    }

    return this.toDto(receipt as ReceiptDetails);
  }

  async create(dto: CreateStockReceiptDto): Promise<StockReceiptResponseDto> {
    await this.ensureRelations(dto.supplier_id, dto.created_by, dto.items.map((item) => item.product_id));

    const existingReceipt = await this.stockReceiptsRepository.findByReceiptNumber(dto.receipt_number);
    if (existingReceipt) {
      throw new BadRequestException('Документ надходження з таким номером вже існує.');
    }

    const totalAmount = dto.items.reduce(
      (sum, item) => sum.plus(new Decimal(item.unit_price).mul(item.quantity)),
      new Decimal(0),
    );

    const receipt = await this.prisma.$transaction(async (tx: any) => {
      const createdReceipt = await this.stockReceiptsRepository.create(tx, {
        receipt_number: dto.receipt_number,
        supplier_id: dto.supplier_id,
        created_by: dto.created_by,
        receipt_date: new Date(dto.receipt_date),
        status: dto.status ?? 'COMPLETED',
        total_amount: totalAmount,
        comment: dto.comment,
      });

      for (const item of dto.items) {
        const lineTotal = new Decimal(item.unit_price).mul(item.quantity);

        await this.stockReceiptsRepository.createItem(tx, {
          receipt_id: createdReceipt.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: lineTotal,
        });

        await tx.product.update({
          where: { id: item.product_id },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            product_id: item.product_id,
            transaction_type: 'IN',
            quantity: item.quantity,
            reference_type: 'stock_receipt',
            reference_id: createdReceipt.id,
            created_by: dto.created_by,
            transaction_date: new Date(dto.receipt_date),
            comment: dto.comment ?? 'Надходження товару',
          },
        });
      }

      return tx.stockReceipt.findUniqueOrThrow({
        where: { id: createdReceipt.id },
        include: {
          supplier: true,
          creator: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return this.toDto(receipt as ReceiptDetails);
  }

  private async ensureRelations(supplier_id: number, created_by: number, productIds: number[]) {
    const supplier = await this.suppliersRepository.findById(supplier_id);
    if (!supplier) {
      throw new NotFoundException('Постачальника не знайдено.');
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

  private toDto(receipt: ReceiptDetails): StockReceiptResponseDto {
    return {
      id: receipt.id,
      receipt_number: receipt.receipt_number,
      receipt_date: receipt.receipt_date,
      status: receipt.status,
      total_amount: decimalToNumber(receipt.total_amount),
      comment: receipt.comment,
      supplier: {
        id: receipt.supplier.id,
        name: receipt.supplier.name,
      },
      created_by: {
        id: receipt.creator.id,
        email: receipt.creator.email,
        full_name: receipt.creator.full_name,
      },
      items: receipt.items.map((item: ReceiptDetails['items'][number]) => ({
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