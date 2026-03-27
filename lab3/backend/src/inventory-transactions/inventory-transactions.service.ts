import { Injectable } from '@nestjs/common';
import { InventoryTransactionResponseDto } from './dto/inventory-transaction-response.dto';
import { InventoryTransactionsQueryDto } from './dto/inventory-transactions-query.dto';
import { InventoryTransactionsRepository } from './inventory-transactions.repository';

@Injectable()
export class InventoryTransactionsService {
  constructor(private readonly inventoryTransactionsRepository: InventoryTransactionsRepository) {}

  async findAll(query: InventoryTransactionsQueryDto): Promise<InventoryTransactionResponseDto[]> {
    const transactions = await this.inventoryTransactionsRepository.findAll(query.product_id);

    return transactions.map((transaction: any) => ({
      id: transaction.id,
      transaction_type: transaction.transaction_type,
      quantity: transaction.quantity,
      reference_type: transaction.reference_type,
      reference_id: transaction.reference_id,
      comment: transaction.comment,
      product: {
        id: transaction.product.id,
        name: transaction.product.name,
        sku: transaction.product.sku,
      },
      created_by: {
        id: transaction.creator.id,
        email: transaction.creator.email,
        full_name: transaction.creator.full_name,
      },
      transaction_date: transaction.transaction_date,
    }));
  }
}