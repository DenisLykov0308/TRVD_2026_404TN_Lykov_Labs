import { ApiProperty } from '@nestjs/swagger';

class StockShipmentItemProductDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Ноутбук офісний' })
  name!: string;

  @ApiProperty({ example: 'NB-001' })
  sku!: string;
}

class StockShipmentItemResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ type: StockShipmentItemProductDto })
  product!: StockShipmentItemProductDto;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 26000 })
  unit_price!: number;

  @ApiProperty({ example: 52000 })
  line_total!: number;
}

class StockShipmentCustomerDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'ТОВ Рітейл Центр' })
  name!: string;
}

class StockShipmentCreatedByDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@test.com' })
  email!: string;

  @ApiProperty({ example: 'Системний адміністратор' })
  full_name!: string;
}

export class StockShipmentResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'SHP-001' })
  shipment_number!: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  shipment_date!: Date;

  @ApiProperty({ example: 'COMPLETED' })
  status!: string;

  @ApiProperty({ example: 52000 })
  total_amount!: number;

  @ApiProperty({ example: 'Відвантаження клієнту', required: false })
  comment!: string | null;

  @ApiProperty({ type: StockShipmentCustomerDto })
  customer!: StockShipmentCustomerDto;

  @ApiProperty({ type: StockShipmentCreatedByDto })
  created_by!: StockShipmentCreatedByDto;

  @ApiProperty({ type: StockShipmentItemResponseDto, isArray: true })
  items!: StockShipmentItemResponseDto[];
}