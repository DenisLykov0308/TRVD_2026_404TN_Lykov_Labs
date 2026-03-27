import { ApiProperty } from '@nestjs/swagger';

export class UnitResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Штука' })
  name!: string;

  @ApiProperty({ example: 'шт' })
  short_name!: string;
}