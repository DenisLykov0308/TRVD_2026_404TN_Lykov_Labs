import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'ТОВ ТехноПостач' })
  name!: string;

  @ApiProperty({ example: 'Іван Петренко', required: false })
  contact_person!: string | null;

  @ApiProperty({ example: '+380501112233', required: false })
  phone!: string | null;

  @ApiProperty({ example: 'sales@example.com', required: false })
  email!: string | null;

  @ApiProperty({ example: 'м. Київ, вул. Центральна, 10', required: false })
  address!: string | null;
}