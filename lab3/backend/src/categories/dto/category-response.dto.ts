import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Електроніка' })
  name!: string;

  @ApiProperty({ example: 'Пристрої та комплектуючі', required: false })
  description!: string | null;
}
