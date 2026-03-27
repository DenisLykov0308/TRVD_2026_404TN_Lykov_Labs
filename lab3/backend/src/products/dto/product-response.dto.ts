import { ApiProperty } from '@nestjs/swagger';

class ShortReferenceDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Електроніка' })
  name!: string;
}

class UnitReferenceDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Штука' })
  name!: string;

  @ApiProperty({ example: 'шт' })
  short_name!: string;
}

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Ноутбук офісний' })
  name!: string;

  @ApiProperty({ example: 'NB-001' })
  sku!: string;

  @ApiProperty({ example: 'Базова модель для офісної роботи', required: false })
  description!: string | null;

  @ApiProperty({ example: 25000 })
  price!: number;

  @ApiProperty({ example: 10 })
  quantity!: number;

  @ApiProperty({ example: 5 })
  min_quantity!: number;

  @ApiProperty({ type: ShortReferenceDto })
  category!: ShortReferenceDto;

  @ApiProperty({ type: ShortReferenceDto })
  supplier!: ShortReferenceDto;

  @ApiProperty({ type: UnitReferenceDto })
  unit!: UnitReferenceDto;
}