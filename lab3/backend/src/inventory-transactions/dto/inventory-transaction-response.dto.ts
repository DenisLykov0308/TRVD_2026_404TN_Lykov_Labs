import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TransactionProductDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Ноутбук офісний' })
  name!: string;

  @ApiProperty({ example: 'NB-001' })
  sku!: string;
}

class TransactionCreatedByDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@test.com' })
  email!: string;

  @ApiProperty({ example: 'Системний адміністратор' })
  full_name!: string;
}

export class InventoryTransactionResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'IN' })
  transaction_type!: 'IN' | 'OUT';

  @ApiProperty({ example: 10 })
  quantity!: number;

  @ApiProperty({ example: 'stock_receipt' })
  reference_type!: string;

  @ApiProperty({ example: 1 })
  reference_id!: number;

  @ApiPropertyOptional({ example: 'Оприбуткування товару' })
  comment!: string | null;

  @ApiProperty({ type: TransactionProductDto })
  product!: TransactionProductDto;

  @ApiProperty({ type: TransactionCreatedByDto })
  created_by!: TransactionCreatedByDto;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  transaction_date!: Date;
}