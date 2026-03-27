import { ApiProperty } from '@nestjs/swagger';

class StockReceiptItemProductDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Ноутбук офісний' })
  name!: string;

  @ApiProperty({ example: 'NB-001' })
  sku!: string;
}

class StockReceiptItemResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ type: StockReceiptItemProductDto })
  product!: StockReceiptItemProductDto;

  @ApiProperty({ example: 5 })
  quantity!: number;

  @ApiProperty({ example: 25000 })
  unit_price!: number;

  @ApiProperty({ example: 125000 })
  line_total!: number;
}

class StockReceiptSupplierDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'ТОВ ТехноПостач' })
  name!: string;
}

class StockReceiptCreatedByDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@warehouse.local' })
  email!: string;

  @ApiProperty({ example: 'Системний адміністратор' })
  full_name!: string;
}

export class StockReceiptResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'REC-001' })
  receipt_number!: string;

  @ApiProperty({ example: '2026-03-25T10:00:00.000Z' })
  receipt_date!: Date;

  @ApiProperty({ example: 'COMPLETED' })
  status!: string;

  @ApiProperty({ example: 125000 })
  total_amount!: number;

  @ApiProperty({ example: 'Надходження партії товару', required: false })
  comment!: string | null;

  @ApiProperty({ type: StockReceiptSupplierDto })
  supplier!: StockReceiptSupplierDto;

  @ApiProperty({ type: StockReceiptCreatedByDto })
  created_by!: StockReceiptCreatedByDto;

  @ApiProperty({ type: StockReceiptItemResponseDto, isArray: true })
  items!: StockReceiptItemResponseDto[];
}